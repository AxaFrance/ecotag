using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Groups.Database;

public interface IGroupsRepository
{
    Task<GroupDataModel> GetGroupAsync(string id);

    Task<string> CreateGroupAsync(string groupName);

    Task<GroupDataModel> GetGroupByNameAsync(string name);

    Task DeleteGroupAsync(string id);
}