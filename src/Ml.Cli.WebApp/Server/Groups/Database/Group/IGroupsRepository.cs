using System.Collections.Generic;
using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Groups.Database.Group;

public interface IGroupsRepository
{
    Task<List<GroupDataModel>> GetAllGroupsAsync();
    
    Task<GroupDataModel> GetGroupAsync(string id);

    Task<string> CreateGroupAsync(string groupName);

    Task<GroupDataModel> GetGroupByNameAsync(string name);

    Task<ResultWithError<string, ErrorResult>> UpdateGroupUsers(string groupId, List<string> users);
}