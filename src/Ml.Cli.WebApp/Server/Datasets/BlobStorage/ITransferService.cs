using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Datasets.BlobStorage;

public interface ITransferService
{
    Task UploadStreamAsync(string containerName, string fileName, Stream fileStream);

    Task<IList<string>> GetImportedDatasetsNamesAsync(string containerName);
}