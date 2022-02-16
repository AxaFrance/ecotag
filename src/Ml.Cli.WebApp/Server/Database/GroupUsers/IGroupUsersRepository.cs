using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.Users;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public interface IGroupUsersRepository
{
    Task<bool> IsUserInGroup(string groupId, string userId);
    Task AddUserToGroupAsync(string groupId, string userId);
    Task<List<GroupUsersDataModel>> GetUsersByGroupId(string groupId);
    Task RemoveUsersFromGroup(string groupId);
    Task UpdateGroupUsers(string groupId, List<UserDataModel> newUsersList);
}