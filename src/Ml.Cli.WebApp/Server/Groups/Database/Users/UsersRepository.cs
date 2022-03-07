using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Database.Users;

public class UsersRepository : IUsersRepository
{
    public const string SubjectAlreadyExist = "SubjectAlreadyExist";
    private readonly GroupContext _groupsContext;

    public UsersRepository(GroupContext groupsContext)
    {
        _groupsContext = groupsContext;
    }
    
    public async Task<List<UserDataModel>> GetAllUsersAsync()
    {
        var resultList = new List<UserDataModel>();
        var userModelEnum = _groupsContext.Users.AsAsyncEnumerable();
        await foreach (var user in userModelEnum)
        {
            resultList.Add(user.ToUserDataModel());
        }

        return resultList;
    }
    
    
    public async Task<UserDataModel> GetUserBySubjectAsync(string subject)
    {
        var user = await _groupsContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Subject == subject.ToLower());
        return user?.ToUserDataModel();
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
        
        var result = _groupsContext.Users.AddIfNotExists(userModel, user => user.Subject == subjectLowerCase);
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = SubjectAlreadyExist };
            return commandResult;
        }
        await _groupsContext.SaveChangesAsync();
        commandResult.Data = userModel.Id.ToString();
        return commandResult;
    }
}