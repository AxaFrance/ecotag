using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

public interface IFileService
{
    Task UploadStreamAsync(string blobStorageName, string containerName, string fileName, Stream fileStream);
    Task<ResultWithError<FileServiceDataModel, ErrorResult>> DownloadAsync(string blobStorageName, string containerName,
        string fileName);
    Task<bool> DeleteAsync(string blobStorageName, string containerName, string fileName);
    Task<bool> DeleteContainerAsync(string blobStorageName, string containerName);
    Task<IList<string>> GetImportedDatasetsNamesAsync(string blobStorageName, string containerName);
    Task<IDictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>> GetInputDatasetFilesAsync(
        string blobStorageName, string containerName, string datasetName,
        string datasetType);
}