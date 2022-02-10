using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Ml.Cli.WebApp.Server.Groups.Database;

public class GroupsRepository : IGroupsRepository
{
    private readonly GroupContext _groupsContext;

    public GroupsRepository(GroupContext groupsContext)
    {
        _groupsContext = groupsContext;
    }

    public async Task<GroupDataModel> GetGroupAsync(string id)
    {
        var group = await _groupsContext.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Id == new Guid(id));
        return group?.ToGroupDataModel();
    }

    public async Task<string> CreateGroupAsync(string groupName)
    {
        _groupsContext.Groups.Add(new GroupModel
        {
            Name = groupName
        });
        var result = await _groupsContext.SaveChangesAsync();
        return result.ToString();
    }
}