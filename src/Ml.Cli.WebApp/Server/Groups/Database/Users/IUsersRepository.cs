using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Database.Users;

public interface IUsersRepository
{
    Task<List<UserDataModel>> GetAllUsersAsync();
    
    Task<UserDataModel> GetUserAsync(string id);
    
    Task<UserDataModel> GetUserByEmailAsync(string email);
    
    Task<string> CreateUserAsync(string email);
}