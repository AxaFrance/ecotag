using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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

    public async Task<List<GroupUsersDataModel>> GetUsersByGroupId(string groupId)
    {
        return await _groupUsersContext.GroupUsers.AsNoTracking()
            .Where(element => element.GroupId == new Guid(groupId))
            .Select(element => element.ToGroupUsersDataModel())
            .ToListAsync();
    }
}