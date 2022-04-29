using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Projects.BlobStorage;

[ExcludeFromCodeCoverage]
public class TransferService : ITransferService
{
    private readonly IFileService _fileService;

    public TransferService(IOptions<TransferFileStorageSettings> azureStorageOptions)
    {
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
}