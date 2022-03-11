using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record CreateProjectInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    [Required]
    public string Name { get; set; }
    [Required]
    public string DatasetId { get; set; }
    [Required]
    public string GroupId { get; set; }
    [Range(1, 10)]
    [Required]
    public int NumberCrossAnnotation { get; set; }
    [Required]
    public string AnnotationType { get; set; }
    [Required]
    public List<CreateProjectLabelInput> Labels { get; set; }
}

public record CreateProjectLabelInput
{
    [MaxLength(16)]
    [MinLength(3)]
    [RegularExpression(@"^[a-zA-Z0-9-_]*$")]
    [Required]
    public string Name { get; set; }
    [RegularExpression(@"^#(?:[0-9a-fA-F]{3}){1,2}$")]
    [Required]
    public string Color { get; set; }
    [Required]
    public string Id { get; set; }
}

public class CreateProjectCmd
{
    public const string InvalidModel = "InvalidModel";
    private readonly IProjectsRepository _projectsRepository;

    public CreateProjectCmd(IProjectsRepository projectsRepository)
    {
        _projectsRepository = projectsRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(CreateProjectInput createProjectInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(createProjectInput, true);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var result = await _projectsRepository.CreateProjectAsync(createProjectInput);
        if (!result.IsSuccess)
        {
            commandResult.Error = result.Error;
            return commandResult;
        }

        commandResult.Data = result.Data;
        return commandResult;
    }
}