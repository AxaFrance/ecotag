using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Configuration;

namespace Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

[ExcludeFromCodeCoverage]
public class FileService : IFileService
{
    private readonly IConfiguration _configuration;
    public const string FileNameMissing = "FileNameMissing";
    public const string InvalidFileExtension = "InvalidFileExtension";
    public const string SubDirectoryNotAllowed = "SubDirectoryNotAllowed";
    public const string DownloadError = "DownloadError";
    private const int ChunkSize = 500;

    public FileService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task UploadStreamAsync(string blobFileUri, Stream fileStream)
    {
        var blobStorageName = GetBlobStorageName(blobFileUri);
        var containerName = GetContainerName(blobFileUri);
        var fileName = GetPathEnd(blobFileUri);
        fileStream.Position = 0;
        var cloudBlob = await CloudBlockBlobAsync(blobStorageName, containerName, fileName);
        await cloudBlob.UploadAsync(fileStream);
    }

    public async Task<bool> DeleteAsync(string blobFileUri)
    {
        var blobStorageName = GetBlobStorageName(blobFileUri);
        var containerName = GetContainerName(blobFileUri);
        var fileName = GetPathEnd(blobFileUri);
        var cloudBlob = await CloudBlockBlobAsync(blobStorageName, containerName, fileName);
        return await cloudBlob.DeleteIfExistsAsync();
    }

    public async Task<bool>  DeleteDirectoryAsync(string blobDirectoryUri)
    {
        var blobStorageName = GetBlobStorageName(blobDirectoryUri);
        var containerName = GetContainerName(blobDirectoryUri);
        var pathEnd = GetPathEnd(blobDirectoryUri);
        var container = await CloudBlobContainer(blobStorageName, containerName);

        if (string.IsNullOrEmpty(pathEnd))
        {
            return await container.DeleteIfExistsAsync();
        }

        var resultSegment = container.GetBlobsByHierarchyAsync(prefix:pathEnd+"/", delimiter:"/")
            .AsPages(default, 500);
        await foreach (var blobPage in resultSegment)
        {
            foreach (var blobhierarchyItem in blobPage.Values)
            {
                if (blobhierarchyItem.IsPrefix) continue;
                await container.DeleteBlobIfExistsAsync(blobhierarchyItem.Blob.Name);
            }
        }
        
        return await container.DeleteBlobIfExistsAsync(pathEnd);;
    }
    
    public static string GetPathEnd(string blobFileUri)
    {
        var paths = blobFileUri.Replace("azureblob://", "").Split("/");
        var path = "";
        var pathsLength = paths.Length;
        for (var i = 2; i < pathsLength; i++)
        {
            if (i != pathsLength - 1)
            {
                path += paths[i] + "/";
            }
            else
            {
                path += paths[i];
            }

        }

        return path;
    }
    
    private static string GetContainerName(string blobFileUri)
    {
        var paths = blobFileUri.Replace("azureblob://", "").Split("/");
        return paths[1];
    }
    
    private static string GetBlobStorageName(string blobFileUri)
    {
        var paths = blobFileUri.Replace("azureblob://", "").Split("/");
        return paths[0];
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> DownloadAsync(string blobFileUri)
    {
        var blobStorageName = GetBlobStorageName(blobFileUri);
        var containerName = GetContainerName(blobFileUri);
        var fileName = GetPathEnd(blobFileUri);
        var cloudBlob = await CloudBlockBlobAsync(blobStorageName, containerName, fileName);
        var result = new ResultWithError<FileServiceDataModel, ErrorResult>();
        if (cloudBlob == null)
        {
            result.Error = new ErrorResult
            {
                Key = FileNameMissing
            };
            return result;
        }

        var downloadStreaming = await cloudBlob.DownloadStreamingAsync();
        
        var fileDataModel = new FileServiceDataModel
        {
            Stream = downloadStreaming.Value.Content,
            ContentType = downloadStreaming.Value.Details.ContentType,
            Length = downloadStreaming.Value.Details.ContentLength,
            Name = fileName
        };
        result.Data = fileDataModel;
        return result;
    }

    private async Task<ResultWithError<FileInfoServiceDataModel, ErrorResult>> GetPropertiesAsync(string blobStorageName,
        string containerName, string fileName)
    {
        var cloudBlob = await CloudBlockBlobAsync(blobStorageName, containerName, fileName);
        var result = new ResultWithError<FileInfoServiceDataModel, ErrorResult>();
        if (cloudBlob == null)
        {
            result.Error = new ErrorResult
            {
                Key = FileNameMissing
            };
            return result;
        }

        var downloadStreaming = await cloudBlob.GetPropertiesAsync();
        var fileDataModel = new FileInfoServiceDataModel
        {
            ContentType = downloadStreaming.Value.ContentType,
            Length = downloadStreaming.Value.ContentLength,
            Name = fileName
        };
        result.Data = fileDataModel;
        return result;
    }

    private async Task<BlobContainerClient> CloudBlobContainer(string blobStorageName, string containerName)
    {
        var connectionString = _configuration[$"{blobStorageName}:ConnectionString"];
        var container = new BlobContainerClient(connectionString, containerName);
        await container.CreateIfNotExistsAsync();
        await container.SetAccessPolicyAsync();
        return container;
    }

    private async Task<BlobClient> CloudBlockBlobAsync(string blobStorageName, string containerName, string fileName)
    {
        if (string.IsNullOrEmpty(fileName)) return null;
        var container = await CloudBlobContainer(blobStorageName, containerName);
        var blockBlob = container.GetBlobClient(fileName);
        return blockBlob;
    }
    
    private static async Task<IList<string>> ListBlobsHierarchicalListing(BlobContainerClient container, 
        string prefix, 
        int? segmentSize, int maxLevel =2, int level=0)
    {
        var resultSegment = container.GetBlobsByHierarchyAsync(prefix:prefix, delimiter:"/")
                .AsPages(default, segmentSize);
            var directories = new List<string>();
            await foreach (var blobPage in resultSegment)
            {
                foreach (var blobhierarchyItem in blobPage.Values)
                {
                    if (!blobhierarchyItem.IsPrefix) continue;
                    directories.Add(blobhierarchyItem.Prefix.Substring(0, blobhierarchyItem.Prefix.Length-1));
                    if (level >= maxLevel) continue;
                    var result =await ListBlobsHierarchicalListing(container, blobhierarchyItem.Prefix, null, maxLevel, level+1);
                    directories.AddRange(result);
                }
            }

            return directories;
    }
    
    public async Task<IList<string>> GetImportedDatasetsNamesAsync(string blobUri)
    {
        var blobStorageName = GetBlobStorageName(blobUri);
        var containerName = GetContainerName(blobUri);
        var result = new List<string>();
        if (string.IsNullOrEmpty(containerName)) return null;
        var connectionString = _configuration[$"{blobStorageName}:ConnectionString"];
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (!containerExists) return result;
        await container.SetAccessPolicyAsync();
        var directories = await ListBlobsHierarchicalListing(container, null, null, 1);
        return directories.Where(d=> d.Split("/").Length==2).ToList();
    }


    private async Task<(string Name, ResultWithError<FileInfoServiceDataModel, ErrorResult> GetPropertiesResult)> GetFilePropertiesAsync(BlobItem fileBlob, string blobStorageName, string folderName, string datasetType)
    {
        var filename = fileBlob.Name.Replace(folderName + "/", "");
        if (filename.Contains('/'))
        {
            return (fileBlob.Name,
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                    { Error = new ErrorResult { Key = SubDirectoryNotAllowed } });
        }
        
        if (!FileValidator.IsFileExtensionValid(fileBlob.Name, datasetType))
        {
            return (fileBlob.Name,
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                    { Error = new ErrorResult { Key = InvalidFileExtension } });
        }

        var getPropertiesResult = await GetPropertiesAsync(blobStorageName, "input", fileBlob.Name);
        if (!getPropertiesResult.IsSuccess)
        {
            return (fileBlob.Name,
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                    { Error = new ErrorResult { Key = DownloadError } });
        }

        return (fileBlob.Name, getPropertiesResult);
    }

    public async Task<Boolean> IsFileExistAsync(string blobUri)
    {
        var blobStorageName = GetBlobStorageName(blobUri);
        var containerName = GetContainerName(blobUri);
        var fileName = GetPathEnd(blobUri);
        var blobClient = await CloudBlockBlobAsync(blobStorageName, containerName, fileName);
        return await blobClient.ExistsAsync();
    }

    public async Task<IDictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>> GetInputDatasetFilesAsync(string blobUri,
        string datasetType)
    {
        var blobStorageName = GetBlobStorageName(blobUri);
        var containerName = GetContainerName(blobUri);
        var folderName = GetPathEnd(blobUri);
        var filesResult = new Dictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>();
        var connectionString = _configuration[$"{blobStorageName}:ConnectionString"];
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (!containerExists) return filesResult;
        await container.SetAccessPolicyAsync();
        var filesBlobs = container.GetBlobsAsync(BlobTraits.None, BlobStates.None, folderName);
        await foreach (var fileBlobPage in filesBlobs.AsPages(null, ChunkSize))
        {
            var tasksList = from file in fileBlobPage.Values
                select GetFilePropertiesAsync(file, blobStorageName, folderName, datasetType);
            Task.WaitAll(tasksList.ToArray());
            foreach (var taskResult in tasksList.Select(element => element.Result))
            {
                var filename = taskResult.Name.Replace($"{folderName}/", "");
                if (filename.Contains('/')) continue;
                filesResult.Add(filename, taskResult.GetPropertiesResult);
            }
        }

        return filesResult;
    }
}

public record FileServiceDataModel
{
    public string Name { get; set; }
    public Stream Stream { get; set; }
    public long Length { get; set; }
    public string ContentType { get; set; }
}

public record FileInfoServiceDataModel
{
    public string Name { get; set; }
    public long Length { get; set; }
    public string ContentType { get; set; }
}