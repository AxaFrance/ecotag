using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Options;

namespace Ml.Cli.WebApp.Server.Projects.BlobStorage;

[ExcludeFromCodeCoverage]
public class BlobService : IBlobService
{
    private readonly IOptions<BlobStorageSettings> _azureBlobStorageOptions;

    public BlobService(IOptions<BlobStorageSettings> azureBlobStorageOptions)
    {
        _azureBlobStorageOptions = azureBlobStorageOptions;
    }

    public async Task UploadStreamAsync(string containerName, string fileName, Stream fileStream)
    {
        fileStream.Position = 0;
        var cloudBlob = await CloudBlockBlob(containerName, fileName);
        await cloudBlob.UploadAsync(fileStream);
    }

    private async Task<BlobContainerClient> CloudBlobContainer(string containerName)
    {
        var connectionString = _azureBlobStorageOptions.Value.ConnectionString;
        var container = new BlobContainerClient(connectionString, containerName);
        await container.CreateIfNotExistsAsync();
        await container.SetAccessPolicyAsync();
        return container;
    }

    private async Task<BlobClient> CloudBlockBlob(string containerName, string fileName)
    {
        if (string.IsNullOrEmpty(fileName)) return null;
        var container = await CloudBlobContainer(containerName);
        var blockBlob = container.GetBlobClient(fileName);
        return blockBlob;
    }
}