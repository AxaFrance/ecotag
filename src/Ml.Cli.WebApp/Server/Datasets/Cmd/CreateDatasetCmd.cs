using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public record CreateDatasetCmdInput
{
    [MaxLength(48)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    public string Name { get; set; }

    [RegularExpression(@"Image|Text$")] public string Type { get; set; }

    [RegularExpression(@"Public|Internal|Confidential|Critical$")]
    public string Classification { get; set; }

    [Required]
    [RegularExpression("(?im)^[{(]?[0-9A-F]{8}[-]?(?:[0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$")]
    public string GroupId { get; set; }

    [MaxLength(32)] [MinLength(1)] public string CreatorNameIdentifier { get; set; }
}

public class CreateDatasetCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserNotInGroup = "UserNotInGroup";
    public const string UserNotFound = "UserNotFound";
    public const string GroupNotFound = "GroupNotFound";
    private readonly DatasetsRepository _datasetsRepository;

    private readonly GroupsRepository _groupsRepository;
    private readonly UsersRepository _usersRepository;

    public CreateDatasetCmd(GroupsRepository groupsRepository, DatasetsRepository datasetsRepository,
        UsersRepository usersRepository)
    {
        _groupsRepository = groupsRepository;
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateDatasetCmdInput createGroupInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createGroupInput);
        if (!validationResult.IsSuccess) return commandResult.ReturnError(InvalidModel, validationResult.Errors);

        var group = await _groupsRepository.GetGroupAsync(createGroupInput.GroupId);
        if (group == null) return commandResult.ReturnError(GroupNotFound);

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(createGroupInput.CreatorNameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        if (!user.GroupIds.Contains(createGroupInput.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var createDatasetResult = await _datasetsRepository.CreateDatasetAsync(new CreateDataset
        {
            Classification = createGroupInput.Classification,
            Name = createGroupInput.Name,
            Type = createGroupInput.Type,
            GroupId = createGroupInput.GroupId,
            CreatorNameIdentifier = createGroupInput.CreatorNameIdentifier
        });

        if (!createDatasetResult.IsSuccess)
        {
            commandResult.Error = createDatasetResult.Error;
            return commandResult;
        }

        commandResult.Data = createDatasetResult.Data;
        return commandResult;
    }
}