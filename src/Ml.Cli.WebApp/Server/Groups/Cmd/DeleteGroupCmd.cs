using System;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class DeleteGroupCmd
{
    public const string GroupNotFound = "GroupNotFound";
    private readonly IGroupsRepository _groupsRepository;
    private readonly IGroupUsersRepository _groupUsersRepository;

    public DeleteGroupCmd(IGroupsRepository groupsRepository, IGroupUsersRepository groupUsersRepository)
    {
        _groupsRepository = groupsRepository;
        _groupUsersRepository = groupUsersRepository;
    }
    
    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(string groupId)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        await _groupUsersRepository.RemoveUsersFromGroup(groupId);
        try
        {
            await _groupsRepository.DeleteGroupAsync(groupId);
        }
        catch (Exception e)
        {
            commandResult.Error = new ErrorResult
            {
                Key = e.Message
            };
            return commandResult;
        }

        commandResult.Data = "";
        return commandResult;
    }
}