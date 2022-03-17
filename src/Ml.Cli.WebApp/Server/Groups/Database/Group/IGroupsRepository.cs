using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Cmd;

namespace Ml.Cli.WebApp.Server.Groups.Database.Group;

public interface IGroupsRepository
{
    Task<List<GroupDataModel>> GetAllGroupsAsync(bool? mine, IList<string> groupIds);

    Task<ResultWithError<string, ErrorResult>> CreateGroupAsync(CreateGroupInput group);

    Task<GroupDataModel> GetGroupAsync(string id);
    
    Task<GroupDataModel> GetGroupByNameAsync(string name);

    Task<ResultWithError<string, ErrorResult>> UpdateGroupUsers(string groupId, List<string> users);
}