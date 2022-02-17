using System;
using System.Collections.Generic;
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

    public async Task<List<GroupDataModel>> GetAllGroupsAsync()
    {
        var resultList = new List<GroupDataModel>();
        var groupModelEnum = _groupsContext.Groups.AsAsyncEnumerable();
        await foreach (var group in groupModelEnum)
        {
            resultList.Add(group.ToGroupDataModel());
        }

        return resultList;
    }

    public async Task<GroupDataModel> GetGroupAsync(string id)
    {
        var group = await _groupsContext.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Id == new Guid(id));
        return group?.ToGroupDataModel();
    }

    public async Task<GroupDataModel> GetGroupByNameAsync(string name)
    {
        var group = await _groupsContext.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Name == name);
        return group?.ToGroupDataModel();
    }

    public async Task<string> CreateGroupAsync(string groupName)
    {
        var groupModel = new GroupModel
        {
            Name = groupName
        };
        _groupsContext.Groups.Add(groupModel);
        await _groupsContext.SaveChangesAsync();
        return groupModel.Id.ToString();
    }
}