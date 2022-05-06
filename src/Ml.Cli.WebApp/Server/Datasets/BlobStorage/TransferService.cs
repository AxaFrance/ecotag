using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.BlobStorage;

[ExcludeFromCodeCoverage]
public class TransferService : ITransferService
{
    private const string FileNameAlreadyExists = "FileNameAlreadyExists";
    private const string InvalidFileExtension = "InvalidFileExtension";
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

    public async Task<Dictionary<string, ResultWithError<FileServiceDataModel, ErrorResult>>> DownloadDatasetFilesAsync(string containerName, string datasetName, string datasetId, string datasetType){
        var filesResult = new Dictionary<string, ResultWithError<FileServiceDataModel, ErrorResult>>();
        var connectionString = _azureStorageOptions.Value.ConnectionString;
        var container = new BlobContainerClient(connectionString, containerName);
        var containerExistsResponse = await container.ExistsAsync();
        var containerExists = containerExistsResponse.Value;
        if (containerExists)
        {
            await container.SetAccessPolicyAsync();
            var filesBlobs = container.GetBlobsAsync(BlobTraits.None, BlobStates.None, datasetName);
            await foreach (var fileBlob in filesBlobs)
            {
                if (filesResult.ContainsKey(fileBlob.Name))
                {
                    filesResult.Add(fileBlob.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = FileNameAlreadyExists}});
                    continue;
                }
                if (!FileValidator.IsFileExtensionValid(fileBlob.Name, datasetType))
                {
                    filesResult.Add(fileBlob.Name, new ResultWithError<FileServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = InvalidFileExtension}});
                    continue;
                }
                var fileResult = await _fileService.DownloadAsync("input", fileBlob.Name);
                filesResult.Add(fileBlob.Name, fileResult);
            }
        }

        return filesResult;
    }
}