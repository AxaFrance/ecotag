using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Groups.Database.Users;

public interface IUsersRepository
{
    Task<List<ListUserDataModel>> GetAllUsersAsync();
    
    Task<UserDataModel> GetUserBySubjectAsync(string email);
    
    Task<ResultWithError<string, ErrorResult>> CreateUserAsync(string email, string subject);
}