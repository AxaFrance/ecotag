using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record CreateProjectInput
{
    [MaxLength(48)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    [Required]
    public string Name { get; set; }

    [Required] public string DatasetId { get; set; }

    [Required] public string GroupId { get; set; }

    [Range(1, 10)] [Required] public int NumberCrossAnnotation { get; set; }

    [Required]
    [RegularExpression(
        @"Cropping|ImageClassifier|NamedEntity|Ocr|Rotation|EmlClassifier|DocumentClassifier|DocumentOcr$")]
    public string AnnotationType { get; set; }

    [Required] [MaxLength(90)] public List<CreateProjectLabelInput> Labels { get; set; }
}

public record CreateProjectLabelInput
{
    [MaxLength(48)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    [Required]
    public string Name { get; set; }

    [RegularExpression(@"^#(?:[0-9a-fA-F]{3}){1,2}$")]
    [Required]
    public string Color { get; set; }

    [Required] public string Id { get; set; }
}

public record CreateProjectWithUserInput
{
    [Required] public CreateProjectInput CreateProjectInput { get; set; }

    [Required] public string CreatorNameIdentifier { get; set; }
}

public class CreateProjectCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string GroupNotFound = "GroupNotFound";
    public const string UserNotFound = "UserNotFound";
    public const string UserNotInGroup = "UserNotInGroup";
    private readonly AnnotationsRepository _annotationsRepository;
    private readonly GroupsRepository _groupsRepository;

    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public CreateProjectCmd(ProjectsRepository projectsRepository, GroupsRepository groupsRepository,
        UsersRepository usersRepository, AnnotationsRepository annotationsRepository)
    {
        _projectsRepository = projectsRepository;
        _groupsRepository = groupsRepository;
        _usersRepository = usersRepository;
        _annotationsRepository = annotationsRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(
        CreateProjectWithUserInput createProjectWithUserInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createProjectWithUserInput, true);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var labelsNamesArray =
            createProjectWithUserInput.CreateProjectInput.Labels.Select(label => label.Name).ToList();
        var labelsNamesHaveDuplicates = labelsNamesArray.Count != labelsNamesArray.Distinct().Count();
        if (labelsNamesHaveDuplicates)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var group = await _groupsRepository.GetGroupAsync(createProjectWithUserInput.CreateProjectInput.GroupId);
        if (group == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = GroupNotFound,
                Error = null
            };
            return commandResult;
        }

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(createProjectWithUserInput
            .CreatorNameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
                Error = null
            };
            return commandResult;
        }

        if (!user.GroupIds.Contains(createProjectWithUserInput.CreateProjectInput.GroupId))
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotInGroup,
                Error = null
            };
            return commandResult;
        }

        var result = await _projectsRepository.CreateProjectAsync(createProjectWithUserInput);
        if (!result.IsSuccess)
        {
            commandResult.Error = result.Error;
            return commandResult;
        }

        if (_annotationsRepository != null)
            await _annotationsRepository.InitializeReservationAsync(
                createProjectWithUserInput.CreateProjectInput.DatasetId, result.Data);
        commandResult.Data = result.Data;
        return commandResult;
    }
}