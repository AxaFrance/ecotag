using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Projects.Cmd;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public interface IDatasetsRepository
{
    Task<ResultWithError<string, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset);
    Task<IList<ListDataset>> ListDatasetAsync(bool? locked, IList<string> groupIds);
    Task<GetDataset> GetDatasetAsync(string datasetId);
    Task<GetDatasetInfo> GetDatasetInfoAsync(string datasetId);
    Task<bool> LockAsync(string datasetId);
    Task<ResultWithError<FileDataModel, ErrorResult>> GetFileAsync(string datasetId, string fileId);
    Task<ResultWithError<bool, ErrorResult>> DeleteFileAsync(string datasetId, string fileId);

    Task<ResultWithError<string, ErrorResult>> CreateFileAsync(string datasetId, Stream stream,
        string fileName, string contentType, string creatorNameIdentifier);

    Task<ResultWithError<string, ErrorResult>>
        CreateOrUpdateAnnotation(SaveAnnotationInput saveAnnotationInput);
}