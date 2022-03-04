using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public record UpdateGroupInput
{
    [Required]
    public string Id { get; set; }
    public List<string> UserIds { get; set; }
}

public class UpdateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserDuplicate = "UserDuplicate";
    private readonly IGroupsRepository _groupsRepository;
    
    public UpdateGroupCmd(IGroupsRepository groupsRepository)
    {
        _groupsRepository = groupsRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(UpdateGroupInput updateGroupInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(updateGroupInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var duplicateFinder = new HashSet<string>();
        foreach (var userId in updateGroupInput.UserIds)
        {
            var isDuplicate = !duplicateFinder.Add(userId);
            if (isDuplicate)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = UserDuplicate
                };
                return commandResult;
            }
        }

        commandResult = await _groupsRepository.UpdateGroupUsers(updateGroupInput.Id, updateGroupInput.UserIds);
        return commandResult;
    }
}