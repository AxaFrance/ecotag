using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record CreateProjectInput
{
    [MaxLength(16)]
    [MinLength(3)]
    public string Name { get; set; }
    public string DataSetId { get; set; }
    public string GroupId { get; set; }
    public string Classification { get; set; }
    public int NumberCrossAnnotation { get; set; }
    public long CreateDate { get; set; }
    public string TypeAnnotation { get; set; }
    public List<CreateProjectLabelInput> Labels { get; set; }
}

public record CreateProjectLabelInput
{
    public string Name { get; set; }
    public string Color { get; set; }
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

        var validationResult = new Validation().Validate(createProjectInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var result = await _projectsRepository.CreateProjectAsync(createProjectInput.Name.ToLower());
        if (!result.IsSuccess)
        {
            commandResult.Error = result.Error;
            return commandResult;
        }

        commandResult.Data = result.Data;
        return commandResult;
    }
}