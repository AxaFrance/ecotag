using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public class GroupUsersRepository : IGroupUsersRepository
{
    private readonly GroupUsersContext _groupUsersContext;

    public GroupUsersRepository(GroupUsersContext groupUsersContext)
    {
        _groupUsersContext = groupUsersContext;
    }

    public async Task<bool> IsUserInGroup(string groupId, string userId)
    {
        var relationInDatabase = await _groupUsersContext.GroupUsers.AsNoTracking().FirstOrDefaultAsync(current =>
            current.GroupId == new Guid(groupId) && current.UserId == new Guid(userId));
        return relationInDatabase != null;
    }
    
    public async Task AddUserToGroupAsync(string groupId, string userId)
    {
        if (await IsUserInGroup(groupId, userId))
        {
            return;
        }
        var groupUserModel = new GroupUsersModel
        {
            GroupId = new Guid(groupId),
            UserId = new Guid(userId)
        };
        _groupUsersContext.GroupUsers.Add(groupUserModel);
        await _groupUsersContext.SaveChangesAsync();
    }

    public async Task<List<GroupUsersDataModel>> GetUsersByGroupId(string groupId)
    {
        return await _groupUsersContext.GroupUsers.AsNoTracking()
            .Where(element => element.GroupId == new Guid(groupId))
            .Select(element => element.ToGroupUsersDataModel())
            .ToListAsync();
    }

    public async Task RemoveUsersFromGroup(string groupId)
    {
        foreach (var groupUserModel in _groupUsersContext.GroupUsers)
        {
            if (groupUserModel.GroupId == new Guid(groupId))
            {
                _groupUsersContext.GroupUsers.Remove(groupUserModel);
            }
        }
        
        await _groupUsersContext.SaveChangesAsync();
    }

    public async Task UpdateGroupUsers(string groupId, List<UserDataModel> newUsersList)
    {
        foreach (var groupUserModel in _groupUsersContext.GroupUsers)
        {
            var isRelationOnRemovedUser = newUsersList.Where(current => new Guid(current.Id) == groupUserModel.UserId).IsNullOrEmpty();
            if (groupUserModel.GroupId == new Guid(groupId) && isRelationOnRemovedUser)
            {
                _groupUsersContext.GroupUsers.Remove(groupUserModel);
            }
        }

        foreach (var newUser in newUsersList)
        {
            await AddUserToGroupAsync(groupId, newUser.Id);
        }

        await _groupUsersContext.SaveChangesAsync();
    }
}