using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public record UpdateGroupInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z-_]*$")]
    public string Name { get; set; }
    public string Id { get; set; }
    public List<UserDataModel> Users { get; set; }
}

public class UpdateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string GroupNotFound = "GroupNotFound";
    public const string UserNotFound = "UserNotFound";
    private readonly IGroupsRepository _groupsRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly IGroupUsersRepository _groupUsersRepository;
    
    public UpdateGroupCmd(IGroupsRepository groupsRepository, IUsersRepository usersRepository, IGroupUsersRepository groupUsersRepository)
    {
        _groupsRepository = groupsRepository;
        _usersRepository = usersRepository;
        _groupUsersRepository = groupUsersRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(UpdateGroupInput updateGroupInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(updateGroupInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }
        
        var isGroupInDatabase = await _groupsRepository.GetGroupAsync(updateGroupInput.Id) != null;
        if (!isGroupInDatabase)
        {
            commandResult.Error = new ErrorResult
            {
                Key = GroupNotFound
            };
            return commandResult;
        }

        foreach (var user in updateGroupInput.Users)
        {
            var isUserInDatabase = await _usersRepository.GetUserByEmailAsync(user.Email) != null;
            if (!isUserInDatabase)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = UserNotFound
                };
                return commandResult;
            }
        }

        foreach (var user in updateGroupInput.Users)
        {
            await _groupUsersRepository.AddUserToGroupAsync(updateGroupInput.Id, user.Id);
        }
        
        commandResult.Data = updateGroupInput.Id;
        return commandResult;
    }
}