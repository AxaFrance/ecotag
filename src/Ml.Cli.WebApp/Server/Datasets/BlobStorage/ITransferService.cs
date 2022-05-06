using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.BlobStorage;

public interface ITransferService
{
    Task UploadStreamAsync(string containerName, string fileName, Stream fileStream);

    Task<IList<string>> GetImportedDatasetsNamesAsync(string containerName);

    Task<Dictionary<string, ResultWithError<FileServiceDataModel, ErrorResult>>> DownloadDatasetFilesAsync(
        string containerName, string datasetName, string datasetId, string datasetType);
}