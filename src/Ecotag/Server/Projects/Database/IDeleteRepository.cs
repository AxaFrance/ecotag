using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Database;

public interface IDeleteRepository
{
    Task DeleteProjectWithDatasetAsync(GetDatasetInfo dataset, string projectId);
}