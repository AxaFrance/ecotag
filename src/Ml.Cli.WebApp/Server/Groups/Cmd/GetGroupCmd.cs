using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetGroupCmd
{
    public const string GroupNotFound = "GroupNotFound";
    private readonly IGroupsRepository _groupsRepository;

    public GetGroupCmd(IGroupsRepository groupsRepository)
    {
        _groupsRepository = groupsRepository;
    }

    public async Task<ResultWithError<GroupDataModel, ErrorResult>> ExecuteAsync(string groupId)
    {
        var commandResult = new ResultWithError<GroupDataModel, ErrorResult>();

        var groupInDatabase = await _groupsRepository.GetGroupAsync(groupId);
        if (groupInDatabase == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = GroupNotFound
            };
            return commandResult;
        }

        commandResult.Data = groupInDatabase;
        return commandResult;
    }
}