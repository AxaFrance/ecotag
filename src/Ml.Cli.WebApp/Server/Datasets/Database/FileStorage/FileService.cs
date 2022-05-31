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
    public const string DownloadError = "DownloadError";
    private const int ChunkSize = 500;

    public FileService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task UploadStreamAsync(string blobStorageName, string containerName, string fileName, Stream fileStream)
    {
        fileStream.Position = 0;
        var cloudBlob = await CloudBlockBlob(blobStorageName, containerName, fileName);
        await cloudBlob.UploadAsync(fileStream);
    }

    public async Task<bool> DeleteAsync(string blobStorageName, string containerName, string fileName)
    {
        var cloudBlob = await CloudBlockBlob(blobStorageName, containerName, fileName);
        return await cloudBlob.DeleteIfExistsAsync();
    }

    public async Task<bool> DeleteContainerAsync(string blobStorageName, string containerName)
    {
        var container = await CloudBlobContainer(blobStorageName, containerName);
        return await container.DeleteIfExistsAsync();
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> DownloadAsync(string blobStorageName, string containerName, string fileName)
    {
        var cloudBlob = await CloudBlockBlob(blobStorageName, containerName, fileName);
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
        var cloudBlob = await CloudBlockBlob(blobStorageName, containerName, fileName);
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

    private async Task<BlobClient> CloudBlockBlob(string blobStorageName, string containerName, string fileName)
    {
        if (string.IsNullOrEmpty(fileName)) return null;
        var container = await CloudBlobContainer(blobStorageName, containerName);
        var blockBlob = container.GetBlobClient(fileName);
        return blockBlob;
    }
    
    public async Task<IList<string>> GetImportedDatasetsNamesAsync(string blobStorageName, string containerName)
    {
        var result = new List<string>();
        if (string.IsNullOrEmpty(containerName)) return null;
        var connectionString = _configuration[$"{blobStorageName}:ConnectionString"];
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (!containerExists) return result;
        await container.SetAccessPolicyAsync();
        var blobsResponse = container.GetBlobsAsync();
        await foreach (var blobItem in blobsResponse)
        {
            if (blobItem.Name.Count(element => element.Equals('/')) <= 1) continue;
            var index = blobItem.Name.LastIndexOf("/", StringComparison.Ordinal);
            if (index < 0) continue;
            var folderName = blobItem.Name.Substring(0, index);
            if(!result.Contains(folderName)) result.Add(blobItem.Name.Substring(0, index));
        }

        return result;
    }

    private async Task<(string Name, ResultWithError<FileInfoServiceDataModel, ErrorResult> GetPropertiesResult)> GetFileProperties(BlobItem fileBlob, string blobStorageName, string datasetType)
    {
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
    
    public async Task<IDictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>> GetInputDatasetFilesAsync(string blobStorageName, string containerName, string datasetName,
        string datasetType)
    {
        var filesResult = new Dictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>();
        var connectionString = _configuration[$"{blobStorageName}:ConnectionString"];
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (!containerExists) return filesResult;
        await container.SetAccessPolicyAsync();
        var filesBlobs = container.GetBlobsAsync(BlobTraits.None, BlobStates.None, datasetName);
        await foreach (var fileBlobPage in filesBlobs.AsPages(null, ChunkSize))
        {
            var tasksList = from file in fileBlobPage.Values
                select GetFileProperties(file, blobStorageName, datasetType);
            Task.WaitAll(tasksList.ToArray());
            foreach (var taskResult in tasksList.Select(element => element.Result))
            {
                filesResult.Add(taskResult.Name, taskResult.GetPropertiesResult);
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