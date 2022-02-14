using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public interface IGroupUsersRepository
{
    Task<string> AddUserToGroupAsync(string groupId, string userId);
}