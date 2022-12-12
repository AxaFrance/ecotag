using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using Microsoft.Extensions.Options;

namespace AxaGuilDEv.Ecotag.Server.Datasets.Cmd;

public record CreateDatasetCmdInput
{
    [MaxLength(48)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    public string Name { get; set; }

    [RegularExpression(@"Image|Text|Eml|Document")]
    public string Type { get; set; }

    [RegularExpression(@"Public|Internal|Confidential|Critical$")]
    public string Classification { get; set; }

    [Required]
    [RegularExpression("(?im)^[{(]?[0-9A-F]{8}[-]?(?:[0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$")]
    public string GroupId { get; set; }

    [MaxLength(64)] [MinLength(1)] public string CreatorNameIdentifier { get; set; }

    [MaxLength(256)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_/]*$")]
    public string ImportedDatasetName { get; set; }
}

public class CreateDatasetCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserNotInGroup = "UserNotInGroup";
    public const string UserNotFound = "UserNotFound";
    public const string GroupNotFound = "GroupNotFound";
    public const string DatasetImportNotActivated = "DatasetImportNotActivated";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IOptions<DatasetsSettings> _datasetsSettings;

    private readonly GroupsRepository _groupsRepository;
    private readonly UsersRepository _usersRepository;

    public CreateDatasetCmd(GroupsRepository groupsRepository, DatasetsRepository datasetsRepository,
        UsersRepository usersRepository, IOptions<DatasetsSettings> datasetsSettings)
    {
        _groupsRepository = groupsRepository;
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
        _datasetsSettings = datasetsSettings;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateDatasetCmdInput createDatasetInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createDatasetInput);
        if (!validationResult.IsSuccess) return commandResult.ReturnError(InvalidModel, validationResult.Errors);

        if (!_datasetsSettings.Value.IsBlobTransferActive &&
            !string.IsNullOrEmpty(createDatasetInput.ImportedDatasetName))
            return commandResult.ReturnError(DatasetImportNotActivated);

        var group = await _groupsRepository.GetGroupAsync(createDatasetInput.GroupId);
        if (group == null) return commandResult.ReturnError(GroupNotFound);

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(createDatasetInput
            .CreatorNameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        if (!user.GroupIds.Contains(createDatasetInput.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var createDatasetResult = await _datasetsRepository.CreateDatasetAsync(new CreateDataset
        {
            Classification = createDatasetInput.Classification,
            Name = createDatasetInput.Name,
            Type = createDatasetInput.Type,
            GroupId = createDatasetInput.GroupId,
            CreatorNameIdentifier = createDatasetInput.CreatorNameIdentifier,
            ImportedDatasetName = createDatasetInput.ImportedDatasetName
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