using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.BlobStorage;

[ExcludeFromCodeCoverage]
public class TransferService : ITransferService
{
    private const string FileNameAlreadyExists = "FileNameAlreadyExists";
    public const string InvalidFileExtension = "InvalidFileExtension";
    private const string FileTooLarge = "FileTooLarge";
    private const string UploadError = "UploadError";
    public const int ChunkSize = 1000;
    private readonly IFileService _fileService;
    private readonly IOptions<TransferFileStorageSettings> _azureStorageOptions;

    public TransferService(IOptions<TransferFileStorageSettings> azureStorageOptions)
    {
        _azureStorageOptions = azureStorageOptions;
        _fileService = new FileService(
            new OptionsWrapper<StorageSettings>(
                    new StorageSettings
                    {
                        ConnectionString = azureStorageOptions.Value.ConnectionString
                    }
                )
            );
    }

    public async Task UploadStreamAsync(string containerName, string fileName, Stream fileStream)
    {
        await _fileService.UploadStreamAsync(containerName, fileName, fileStream);
    }

    public async Task<IList<string>> GetImportedDatasetsNamesAsync(string containerName)
    {
        var result = new List<string>();
        if (string.IsNullOrEmpty(containerName)) return null;
        var connectionString = _azureStorageOptions.Value.ConnectionString;
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (containerExists)
        {
            await container.SetAccessPolicyAsync();
            var blobsResponse = container.GetBlobsAsync();
            await foreach (var blobItem in blobsResponse)
            {
                if (blobItem.Name.Count(element => element.Equals('/')) <= 1) continue;
                var index = blobItem.Name.LastIndexOf("/", StringComparison.Ordinal);
                if (index >= 0)
                {
                    var folderName = blobItem.Name.Substring(0, index);
                    if(!result.Contains(folderName)) result.Add(blobItem.Name.Substring(0, index));
                }
            }
        }

        return result;
    }

    public async Task<IDictionary<string, ResultWithError<FileServiceDataModel, ErrorResult>>> TransferDatasetFilesAsync(string containerName, string datasetName, string datasetId,
        string datasetType)
    {
        var filesResult = new ConcurrentDictionary<string, ResultWithError<FileServiceDataModel, ErrorResult>>();
        var connectionString = _azureStorageOptions.Value.ConnectionString;
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (containerExists)
        {
            await container.SetAccessPolicyAsync();
            var filesBlobs = container.GetBlobsAsync(BlobTraits.None, BlobStates.None, datasetName);
            await foreach (var chunk in filesBlobs.AsPages(null, ChunkSize))
            {
                try
                {
                    await Parallel.ForEachAsync(chunk.Values, async (item, token)  =>
                    {
                        await using var memoryStream = new MemoryStream();
                        var fileName = item.Name.Substring(item.Name.LastIndexOf("/", StringComparison.Ordinal) + 1);
                        if (filesResult.Any(element =>
                                element.Key.Substring(element.Key.LastIndexOf("/", StringComparison.Ordinal) + 1) ==
                                fileName))
                        {
                            filesResult.TryAdd(item.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = FileNameAlreadyExists}});
                            return;
                        }
                        if (!FileValidator.IsFileExtensionValid(item.Name, datasetType))
                        {
                            filesResult.TryAdd(item.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = InvalidFileExtension}});
                            return;
                        }
                        var downloadResult = await _fileService.DownloadAsync("input", item.Name);
                        if (!downloadResult.IsSuccess)
                        {
                            filesResult.TryAdd(item.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = downloadResult.Error});
                            return;
                        }

                        await downloadResult.Data.Stream.CopyToAsync(memoryStream);
                        if (!FileValidator.IsFileSizeValid(memoryStream))
                        {
                            filesResult.TryAdd(item.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = FileTooLarge}});
                            return;
                        }
                        await _fileService.UploadStreamAsync(datasetId, fileName, memoryStream);
                        filesResult.TryAdd(item.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Data = downloadResult.Data});
                    });
                }
                catch (Exception)
                {
                    foreach (var file in chunk.Values.Where(element => !filesResult.ContainsKey(element.Name)))
                    {
                        filesResult.TryAdd(file.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = UploadError}});
                    }
                }
            }
        }

        return filesResult;
    }
}