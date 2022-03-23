using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record SaveAnnotationInput
{
    public string ProjectId { get; set; }
    public string FileId { get; set; }
    public AnnotationInput AnnotationInput { get; set; }
}

public class SaveAnnotationCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string GroupNotFound = "GroupNotFound";
    public const string UserNotFound = "UserNotFound";
    public const string UserNotInGroup = "UserNotInGroup";
    
    private readonly IProjectsRepository _projectsRepository;
    private readonly IGroupsRepository _groupsRepository;
    private readonly IUsersRepository _usersRepository;

    public SaveAnnotationCmd(IProjectsRepository projectsRepository, IGroupsRepository groupsRepository, IUsersRepository usersRepository)
    {
        _projectsRepository = projectsRepository;
        _groupsRepository = groupsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(SaveAnnotationInput createProjectWithUserInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createProjectWithUserInput, true);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

      //  commandResult.Data = result.Data;
        return commandResult;
    }
}