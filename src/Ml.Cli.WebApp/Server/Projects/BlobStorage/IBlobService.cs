using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Projects.BlobStorage;

public interface IBlobService
{
    Task UploadStreamAsync(string containerName, string fileName, Stream fileStream);
}