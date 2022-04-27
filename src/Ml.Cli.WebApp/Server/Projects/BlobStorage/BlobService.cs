using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Projects.BlobStorage;

[ExcludeFromCodeCoverage]
public class BlobService : IBlobService
{
    private readonly IFileService _fileService;

    public BlobService(IFileService fileService)
    {
        _fileService = fileService;
    }

    public async Task UploadStreamAsync(string containerName, string fileName, Stream fileStream)
    {
        await _fileService.UploadStreamAsync(containerName, fileName, fileStream);
    }
}