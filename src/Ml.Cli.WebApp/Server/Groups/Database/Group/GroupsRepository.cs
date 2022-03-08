using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;

namespace Ml.Cli.WebApp.Server.Groups.Database.Group;

public class GroupsRepository : IGroupsRepository
{
    private readonly GroupContext _groupsContext;
    private readonly IServiceProvider _serviceProvider;
    public const string GroupNotFound = "GroupNotFound";
    public const string UserNotFound = "UserNotFound";
    public const string AlreadyTakenName = "AlreadyTakenName";

    public GroupsRepository(GroupContext groupsContext, IServiceProvider serviceProvider)
    {
        _groupsContext = groupsContext;
        _serviceProvider = serviceProvider;
    }

    public async Task<List<GroupDataModel>> GetAllGroupsAsync()
    {
        var groupModelEnum = await _groupsContext.Groups
            .Include(group => group.GroupUsers)
            .AsNoTracking().ToListAsync();
        return groupModelEnum.ConvertAll(element => element.ToGroupDataModel());
    }

    public async Task<GroupDataModel> GetGroupAsync(string id)
    {
        var group = await _groupsContext.Groups
            .Include(group => group.GroupUsers)
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Id == new Guid(id));
        return group?.ToGroupDataModel();
    }

    public async Task<GroupDataModel> GetGroupByNameAsync(string name)
    {
        var group = await _groupsContext.Groups
            .Include(group => group.GroupUsers)
            .AsNoTracking()
            .FirstOrDefaultAsync(g => g.Name == name);
        return group?.ToGroupDataModel();
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateGroupAsync(string groupName)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var groupModel = new GroupModel
        {
            Name = groupName
        };
        var result = _groupsContext.Groups.AddIfNotExists(groupModel, group => group.Name == groupModel.Name);
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        try
        {
            await _groupsContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        commandResult.Data = groupModel.Id.ToString();
        return commandResult;
    }

    public async Task<ResultWithError<string, ErrorResult>> UpdateGroupUsers(string groupId, List<string> users)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var groupsTask = _groupsContext.Groups.Where(group => group.Id == new Guid(groupId))
            .Include(group => group.GroupUsers).FirstOrDefaultAsync();
        var scope = _serviceProvider.CreateScope();
        var groupContext2 = scope.ServiceProvider.GetService<GroupContext>();
        
        var usersTask = groupContext2.Users.Where(user => users.Select(u => new Guid(u)).ToList().Contains(user.Id))
            .ToListAsync();
        Task.WaitAll(groupsTask, usersTask);
        var groupModel = groupsTask.Result;
        if (groupModel == null)
        {
            commandResult.Error = new ErrorResult { Key = GroupNotFound };
            return commandResult;
        }

        var usersDb = usersTask.Result;
        if (usersDb.Count < users.Count)
        {
            commandResult.Error = new ErrorResult { Key = UserNotFound };
            return commandResult;
        }

        groupModel.GroupUsers.RemoveAll(groupUser => !users.Contains(groupUser.UserId.ToString()));

        foreach (var newUser in users)
        {
            var isElementInGroupUsers = groupModel.GroupUsers.Any(element => element.UserId == new Guid(newUser));
            if (!isElementInGroupUsers)
            {
                groupModel.GroupUsers.Add(new GroupUsersModel() { Group = groupModel, UserId = new Guid(newUser) });
            }
        }

        await _groupsContext.SaveChangesAsync();

        return commandResult;
    }
}