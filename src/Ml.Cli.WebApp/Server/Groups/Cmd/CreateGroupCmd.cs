using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public record CreateGroupInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z-_]*$")]
    public string Name { get; set; }
    
    public List<string> UserIds { get; set; }
}

public class CreateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    private readonly IGroupsRepository _groupsRepository;

    public CreateGroupCmd(IGroupsRepository groupsRepository)
    {
        _groupsRepository = groupsRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateGroupInput createGroupInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createGroupInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }
        
        var result = await _groupsRepository.CreateGroupAsync(createGroupInput.Name.ToLower());
        if (!result.IsSuccess)
        {
            commandResult.Error = result.Error;
            return commandResult;
        }
        commandResult.Data = result.Data;

        return commandResult;
    }
}