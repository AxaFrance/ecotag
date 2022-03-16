using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Database.Users;

public class UsersRepository : IUsersRepository
{
    public const string SubjectAlreadyExist = "SubjectAlreadyExist";
    private readonly GroupContext _groupsContext;
    private readonly IMemoryCache _cache;

    public UsersRepository(GroupContext groupsContext, IMemoryCache cache)
    {
        _groupsContext = groupsContext;
        _cache = cache;
    }
    
    public async Task<List<UserDataModel>> GetAllUsersAsync()
    {
        var resultList = new List<UserDataModel>();
        var userModelEnum = _groupsContext.Users.AsAsyncEnumerable();
        await foreach (var user in userModelEnum)
        {
            resultList.Add(user.ToListUserDataModel());
        }
        return resultList;
    }

    public async Task<UserDataModelWithGroups> GetUserBySubjectWithGroupIdsAsync(string nameIdentity)
    { 
        var user = await _groupsContext.Users.Include(user => user.GroupUsers).AsNoTracking().FirstOrDefaultAsync(u => u.Subject == nameIdentity.ToLower());
        return user?.ToUserDataModelWithGroups();
    }
    
    public async Task<UserDataModel> GetUserBySubjectAsync(string subject)
    {
        var cacheEntry = await _cache.GetOrCreateAsync($"GetUserBySubjectAsync({subject})", async entry =>
        {
            var user = await _groupsContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Subject == subject.ToLower());
            entry.AbsoluteExpirationRelativeToNow =
                user == null ? TimeSpan.FromMilliseconds(1) : TimeSpan.FromHours(1);
            entry.SlidingExpiration = TimeSpan.FromMinutes(1);
            return user;
        });
            
        return cacheEntry?.ToUserDataModel();
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateUserAsync(string email, string subject)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var subjectLowerCase = subject.ToLower();
        var userModel = new UserModel
        {
            Email = email.ToLower(),
            Subject = subjectLowerCase
        };
        _groupsContext.Users.Add(userModel);
        try
        {
            await _groupsContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = SubjectAlreadyExist };
            return commandResult;
        }
        commandResult.Data = userModel.Id.ToString();
        return commandResult;
    }
}