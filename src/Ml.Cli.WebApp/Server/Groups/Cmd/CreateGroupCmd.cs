using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public record GroupInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    public string Name { get; set; }
    
    public List<string> UserIds { get; set; }
}

public record CreateGroupInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    public string Name { get; set; }
    
    [MaxLength(32)]
    [MinLength(1)]
    public string CreatorNameIdentifier { get; set; }
    
    public List<string> UserIds { get; set; }
}

public class CreateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserNotFound = "UserNotFound";
    
    private readonly IGroupsRepository _groupsRepository;
    private readonly IUsersRepository _usersRepository;

    public CreateGroupCmd(IGroupsRepository groupsRepository, IUsersRepository usersRepository)
    {
        _groupsRepository = groupsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateGroupInput createGroupInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createGroupInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var user = await _usersRepository.GetUserBySubjectAsync(createGroupInput.CreatorNameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
                Error = null
            };
            return commandResult;
        }
        
        var result = await _groupsRepository.CreateGroupAsync(createGroupInput);
        if (!result.IsSuccess)
        {
            commandResult.Error = result.Error;
            return commandResult;
        }
        commandResult.Data = result.Data;

        return commandResult;
    }
}