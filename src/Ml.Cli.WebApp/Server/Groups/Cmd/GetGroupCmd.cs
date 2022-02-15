using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string GroupNotFound = "GroupNotFound";
    private readonly IGroupsRepository _groupsRepository;
    private readonly IGroupUsersRepository _groupUsersRepository;
    private readonly IUsersRepository _usersRepository;

    public GetGroupCmd(IGroupsRepository groupsRepository, IGroupUsersRepository groupUsersRepository, IUsersRepository usersRepository)
    {
        _groupsRepository = groupsRepository;
        _groupUsersRepository = groupUsersRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<GroupWithUsersDataModel, ErrorResult>> ExecuteAsync(string groupId)
    {
        var commandResult = new ResultWithError<GroupWithUsersDataModel, ErrorResult>();

        var groupInDatabase = await _groupsRepository.GetGroupAsync(groupId);
        if (groupInDatabase == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = GroupNotFound
            };
            return commandResult;
        }

        var usersInGroup = await _groupUsersRepository.GetUsersByGroupId(groupId);
        var users = new List<UserDataModel>();
        foreach (var groupUser in usersInGroup)
        {
            var user = await _usersRepository.GetUserAsync(groupUser.UserId);
            users.Add(user);
        }

        var groupWithUsers = new GroupWithUsersDataModel
        {
            Id = groupInDatabase.Id,
            Name = groupInDatabase.Name,
            Users = users
        };

        commandResult.Data = groupWithUsers;
        return commandResult;
    }
}