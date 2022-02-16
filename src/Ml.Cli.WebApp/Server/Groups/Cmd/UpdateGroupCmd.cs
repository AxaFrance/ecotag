using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net.Mail;
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
    public List<User> Users { get; set; }
}

public class UpdateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string GroupNotFound = "GroupNotFound";
    public const string UserNotFound = "UserNotFound";
    public const string InvalidMailAddress = "InvalidMailAddress";
    public const string UserDuplicate = "UserDuplicate";
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

        var groupInDatabase = await _groupsRepository.GetGroupByNameAsync(updateGroupInput.Name);
        var isGroupInDatabase = groupInDatabase != null;
        if (!isGroupInDatabase)
        {
            commandResult.Error = new ErrorResult
            {
                Key = GroupNotFound
            };
            return commandResult;
        }

        var usersList = new List<UserDataModel>();
        foreach (var user in updateGroupInput.Users)
        {
            try
            {
                var unused = new MailAddress(user.Email).Address;
            }
            catch (FormatException)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = InvalidMailAddress
                };
                return commandResult;
            }
            var userInDatabase = await _usersRepository.GetUserByEmailAsync(user.Email.ToLower());
            var isUserInDatabase = userInDatabase != null;
            if (!isUserInDatabase)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = UserNotFound
                };
                return commandResult;
            }

            if (usersList.Find(current => current.Id == userInDatabase.Id) != null)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = UserDuplicate
                };
                return commandResult;
            }
            usersList.Add(userInDatabase);
        }

        foreach (var user in usersList)
        {
            await _groupUsersRepository.AddUserToGroupAsync(groupInDatabase.Id, user.Id);
        }

        commandResult.Data = groupInDatabase.Id;
        return commandResult;
    }
}