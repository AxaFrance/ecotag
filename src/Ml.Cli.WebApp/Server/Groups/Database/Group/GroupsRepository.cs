using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Database.Group;

public class GroupsRepository
{
    private readonly GroupContext _groupsContext;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    public const string GroupNotFound = "GroupNotFound";
    public const string UserNotFound = "UserNotFound";
    public const string AlreadyTakenName = "AlreadyTakenName";

    public GroupsRepository(GroupContext groupsContext, IServiceScopeFactory serviceScopeFactory)
    {
        _groupsContext = groupsContext;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task<List<GroupDataModel>> GetAllGroupsAsync(bool? mine, IList<string> groupIds)
    {
        List<GroupModel> groupModelEnum;
        if (mine.HasValue)
        {
            groupModelEnum = await _groupsContext.Groups
                .Where(group => groupIds.Contains(group.Id.ToString()))
                .Include(group => group.GroupUsers)
                .AsNoTracking().ToListAsync();
        }
        else
        {
            groupModelEnum = await _groupsContext.Groups
                .Include(group => group.GroupUsers)
                .AsNoTracking().ToListAsync();
        }

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
    
    public async Task<ResultWithError<string, ErrorResult>> CreateGroupAsync(CreateGroupInput group)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var ticks = DateTime.Now.Ticks;
        var groupModel = new GroupModel
        {
            Name = group.Name.ToLower(),
            CreatorNameIdentifier = group.CreatorNameIdentifier,
            CreateDate = ticks,
            UpdateDate = ticks
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

    public async Task<ResultWithError<string, ErrorResult>> UpdateGroupUsers(string groupId, List<string> users, long updateDate)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var groupsTask = GetGroupsAsync(groupId);
        var usersTask = GetUsersAsync(users);
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

        groupModel.UpdateDate = updateDate;
        await _groupsContext.SaveChangesAsync();

        commandResult.Data = groupModel.Id.ToString();

        return commandResult;
    }

    private async Task<GroupModel?> GetGroupsAsync(string groupId)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        await using var groupContext = scope.ServiceProvider.GetService<GroupContext>();
        var groups = await groupContext.Groups.Where(group => @group.Id == new Guid(groupId))
            .Include(group => @group.GroupUsers).FirstOrDefaultAsync();
        return groups;
    }

    private async Task<List<UserModel>> GetUsersAsync(List<string> users)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        await using var groupContext = scope.ServiceProvider.GetService<GroupContext>();
        var usersResult = await groupContext.Users.AsNoTracking()
            .Where(user => users.Select(u => new Guid(u)).ToList().Contains(user.Id))
            .ToListAsync();
        return usersResult;
    }
}