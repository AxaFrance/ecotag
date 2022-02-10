using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public record CreateGroupInput()
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z-_]*$")]
    public string Name { get; set; }
}

public class CreateGroupCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string AlreadyTakenName = "AlreadyTakenName";
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

        var groupName = createGroupInput.Name;
        var groupInDatabase = await _groupsRepository.GetGroupByNameAsync(groupName.ToLower()) != null;
        if (groupInDatabase)
        {
            commandResult.Error = new ErrorResult
            {
                Key = AlreadyTakenName
            };
            return commandResult;
        }
        commandResult.Data = await _groupsRepository.CreateGroupAsync(createGroupInput.Name.ToLower());

        return commandResult;
    }
}