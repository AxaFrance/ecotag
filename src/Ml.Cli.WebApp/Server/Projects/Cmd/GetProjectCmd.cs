using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetProjectCmd
{
    private readonly IProjectsRepository _projectsRepository;
    public const string ProjectNotFound = "ProjectNotFound";

    public GetProjectCmd(IProjectsRepository projectsRepository)
    {
        _projectsRepository = projectsRepository;
    }

    public async Task<ResultWithError<ProjectDataModel, ErrorResult>> ExecuteAsync(string projectId)
    {
        var commandResult = new ResultWithError<ProjectDataModel, ErrorResult>();
        var projectInDatabase = await _projectsRepository.GetProjectAsync(projectId);
        if (projectInDatabase == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = ProjectNotFound
            };
            return commandResult;
        }

        commandResult.Data = projectInDatabase;
        return commandResult;
    }
}