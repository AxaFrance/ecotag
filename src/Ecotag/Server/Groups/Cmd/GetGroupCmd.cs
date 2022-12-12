using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;

namespace AxaGuilDEv.Ecotag.Server.Groups.Cmd;

public class GetGroupCmd
{
    public const string GroupNotFound = "GroupNotFound";
    private readonly GroupsRepository _groupsRepository;

    public GetGroupCmd(GroupsRepository groupsRepository)
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