using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public record UpdateGroupInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z-_]*$")]
    public string Name { get; set; }
    public string Id { get; set; }
    public List<UserDataModel> Users { get; set; }
}

public class UpdateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string GroupNotFound = "GroupNotFound";
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
        
        var isGroupInDatabase = await _groupsRepository.GetGroupAsync(updateGroupInput.Id) != null;
        if (!isGroupInDatabase)
        {
            commandResult.Error = new ErrorResult
            {
                Key = GroupNotFound
            };
            return commandResult;
        }
        
        //TODO: verifier si l'utilisateur existe en base

        foreach (var user in updateGroupInput.Users)
        {
            await _groupsRepository.AddUserToGroupAsync(updateGroupInput.Id, user.Id);
        }
        
        commandResult.Data = updateGroupInput.Id;
        return commandResult;
    }
}