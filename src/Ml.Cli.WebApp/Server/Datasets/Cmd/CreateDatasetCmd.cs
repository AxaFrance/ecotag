using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public record CreateDatasetCmdInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    public string Name { get; set; }
    
    [RegularExpression(@"Image|Text$")]
    public string Type { get; set; }
    
    [RegularExpression(@"Public|Internal|Confidential|Critical$")]
    public string Classification { get; set; }
    
    [Required]
    public string GroupId { get; set; }
    
    [MaxLength(32)]
    [MinLength(1)]
    public string CreatorNameIdentifier { get; set; }
}

public class CreateDatasetCmd
{
    public const string InvalidModel = "InvalidModel";
    
    private readonly IGroupsRepository _groupsRepository;
    private readonly DatasetsRepository _datasetsRepository;

    public CreateDatasetCmd(IGroupsRepository groupsRepository, DatasetsRepository datasetsRepository)
    {
        _groupsRepository = groupsRepository;
        _datasetsRepository = datasetsRepository;
    }
    
    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateDatasetCmdInput createGroupInput)
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

        var group = _groupsRepository.GetGroupAsync(createGroupInput.GroupId);
        if (group == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var createDatasetResult = await _datasetsRepository.CreateDatasetAsync(new CreateDataset()
        {
            Classification = createGroupInput.Classification,
            Name = createGroupInput.Name,
            Type = createGroupInput.Type,
            GroupId = createGroupInput.GroupId,
            CreatorNameIdentifier = createGroupInput.CreatorNameIdentifier
        });

        if (!createDatasetResult.IsSuccess)
        {
            commandResult.Error = commandResult.Error;
        }
        
        return commandResult;
    }
}