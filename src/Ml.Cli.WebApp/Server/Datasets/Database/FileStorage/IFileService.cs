using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

public interface IFileService
{
    Task UploadStreamAsync(string containerName, string fileName, Stream fileStream);
    Task<ResultWithError<FileServiceDataModel, ErrorResult>> DownloadAsync(string containerName, string fileName);
    Task<bool> DeleteAsync(string containerName, string fileName);
}