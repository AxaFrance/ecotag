using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

public interface IFileService
{
    Task UploadStreamAsync(string blobFileUri, Stream fileStream);
    Task<ResultWithError<FileServiceDataModel, ErrorResult>> DownloadAsync(string blobFileUri);
    Task<bool> DeleteAsync(string blobFileUri);
    Task<bool> DeleteDirectoryAsync(string blobDirectoryUri);
    Task<IList<string>> GetImportedDatasetsNamesAsync(string blobUri);
    Task<Boolean> IsFileExist(string blobUri);
    Task<IDictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>> GetInputDatasetFilesAsync(
        string blobUri,
        string datasetType);
}