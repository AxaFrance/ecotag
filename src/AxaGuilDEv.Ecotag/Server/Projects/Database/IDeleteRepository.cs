using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public interface IDeleteRepository
{
    Task DeleteProjectWithDatasetAsync(GetDatasetInfo dataset, string projectId);
}