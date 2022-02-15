using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public interface IGroupUsersRepository
{
    Task<string> AddUserToGroupAsync(string groupId, string userId);
    Task<List<GroupUsersDataModel>> GetUsersByGroupId(string groupId);
    Task RemoveUsersFromGroup(string groupId);
}