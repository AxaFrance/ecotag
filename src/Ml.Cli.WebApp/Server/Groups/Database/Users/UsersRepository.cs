using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Database.Users;

public class UsersRepository : IUsersRepository
{
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
    
    public async Task<UserDataModel> GetUserAsync(string id)
    {
        var user = await _groupsContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == new Guid(id));
        return user?.ToUserDataModel();
    }
    
    public async Task<UserDataModel> GetUserByEmailAsync(string email)
    {
        var user = await _groupsContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email.ToLower());
        return user?.ToUserDataModel();
    }

    public async Task<string> CreateUserAsync(string email)
    {
        var userModel = new UserModel
        {
            Email = email.ToLower()
        };
        _groupsContext.Users.Add(userModel);
        await _groupsContext.SaveChangesAsync();
        return userModel.Id.ToString();
    }
}