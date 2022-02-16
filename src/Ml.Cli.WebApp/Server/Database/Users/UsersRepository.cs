using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.Users;

public class UsersRepository : IUsersRepository
{
    private readonly UserContext _usersContext;

    public UsersRepository(UserContext usersContext)
    {
        _usersContext = usersContext;
    }
    
    public async Task<UserDataModel> GetUserAsync(string id)
    {
        var user = await _usersContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == new Guid(id));
        return user?.ToUserDataModel();
    }
    
    public async Task<UserDataModel> GetUserByEmailAsync(string email)
    {
        var user = await _usersContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email.ToLower());
        return user?.ToUserDataModel();
    }

    public async Task<string> CreateUserAsync(string email)
    {
        var userModel = new UserModel
        {
            Email = email.ToLower()
        };
        _usersContext.Users.Add(userModel);
        await _usersContext.SaveChangesAsync();
        return userModel.Id.ToString();
    }
}