using System;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public class GroupUsersRepository : IGroupUsersRepository
{
    private readonly GroupUsersContext _groupUsersContext;

    public GroupUsersRepository(GroupUsersContext groupUsersContext)
    {
        _groupUsersContext = groupUsersContext;
    }
    
    public async Task<string> AddUserToGroupAsync(string groupId, string userId)
    {
        var groupUserModel = new GroupUsersModel
        {
            GroupId = new Guid(groupId),
            UserId = new Guid(userId)
        };
        _groupUsersContext.GroupUsers.Add(groupUserModel);
        await _groupUsersContext.SaveChangesAsync();
        return groupUserModel.Id.ToString();
    }
}