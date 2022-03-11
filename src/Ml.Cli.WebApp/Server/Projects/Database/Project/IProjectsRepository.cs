using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Projects.Cmd;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public interface IProjectsRepository
{
    Task<ResultWithError<string, ErrorResult>> CreateProjectAsync(CreateProjectInput projectName);
    Task<List<ProjectDataModel>> GetAllProjectsAsync();
    Task<ProjectDataModel> GetProjectAsync(string projectId);
}