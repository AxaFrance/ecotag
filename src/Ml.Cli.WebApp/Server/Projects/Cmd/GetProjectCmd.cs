using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetProjectCmd
{
    private readonly IProjectsRepository _projectsRepository;
    private readonly IUsersRepository _usersRepository;
    public const string UserNotFound = "UserNotFound";
    public const string ProjectNotFound = "ProjectNotFound";

    public GetProjectCmd(IProjectsRepository projectsRepository, IUsersRepository usersRepository)
    {
        _projectsRepository = projectsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<ProjectDataModel, ErrorResult>> ExecuteAsync(string projectId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<ProjectDataModel, ErrorResult>();
        
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound
            };
            return commandResult;
        }
        var projectInDatabase = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
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