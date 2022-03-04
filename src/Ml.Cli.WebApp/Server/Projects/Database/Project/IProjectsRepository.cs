using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public interface IProjectsRepository
{
    Task<ResultWithError<string, ErrorResult>> CreateProjectAsync(string projectName);
    Task<List<ProjectDataModel>> GetAllProjectsAsync();
    Task<ProjectDataModel> GetProjectAsync(string projectId);
}