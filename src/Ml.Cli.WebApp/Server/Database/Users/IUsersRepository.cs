using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Database.Users;

public interface IUsersRepository
{
    Task<UserDataModel> GetUserAsync(string id);
    
    Task<UserDataModel> GetUserByEmailAsync(string email);
    
    Task<string> CreateUserAsync(string email);
}