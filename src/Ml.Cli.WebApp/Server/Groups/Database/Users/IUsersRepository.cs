using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Groups.Database.Users;

public interface IUsersRepository
{
    Task<List<UserDataModel>> GetAllUsersAsync();
    
    Task<UserDataModel> GetUserBySubjectAsync(string nameIdentity);
    Task<UserDataModelWithGroups> GetUserBySubjectWithGroupIdsAsync(string nameIdentity);
    
    Task<ResultWithError<string, ErrorResult>> CreateUserAsync(string email, string subject);
}