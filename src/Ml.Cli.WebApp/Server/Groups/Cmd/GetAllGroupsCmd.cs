using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetAllGroupsCmd
{
    private readonly IGroupsRepository _groupsRepository;
    private readonly IGroupUsersRepository _groupUsersRepository;

    public GetAllGroupsCmd(IGroupsRepository groupsRepository, IGroupUsersRepository groupUsersRepository)
    {
        _groupsRepository = groupsRepository;
        _groupUsersRepository = groupUsersRepository;
    }

    public async Task<List<GroupWithUsersDataModel>> ExecuteAsync()
    {
        var result = new List<GroupWithUsersDataModel>();
        var groups = await _groupsRepository.GetAllGroupsAsync();
        foreach (var group in groups)
        {
            var usersList = await _groupUsersRepository.GetUsersByGroupId(group.Id);
            var usersIdsList = new List<string>();
            foreach (var user in usersList)
            {
                usersIdsList.Add(user.UserId);
            }

            var groupWithUsers = new GroupWithUsersDataModel
                { Id = group.Id, Name = group.Name, Users = usersIdsList };
            result.Add(groupWithUsers);
        }

        return result;
    }
}