using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record AnnotationInput
{
    
    public string ExpectedOutput { get; set; }
}

public record SaveAnnotationInput
{
    public AnnotationInput AnnotationInput { get; set; }
    public string ProjectId { get; set; }
    public string AnnotationId { get; set; }
    public string FileId { get; set; }
    [MaxLength(32)]
    [MinLength(1)]
    public string CreatorNameIdentifier { get; set; }
}

public class SaveAnnotationCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserNotFound = "UserNotFound";

    private readonly IDatasetsRepository _datasetsRepository;
    private readonly IProjectsRepository _projectsRepository;
    private readonly IUsersRepository _usersRepository;

    public SaveAnnotationCmd(IProjectsRepository projectsRepository, IUsersRepository usersRepository, IDatasetsRepository datasetsRepository)
    {
        _projectsRepository = projectsRepository;
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(SaveAnnotationInput saveAnnotationInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(saveAnnotationInput, true);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(saveAnnotationInput.CreatorNameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
                Error = null
            };
            return commandResult;
        }

        var project =
            await _projectsRepository.GetProjectAsync(saveAnnotationInput.ProjectId,
                user.GroupIds);
        if (!project.IsSuccess)
        {
            commandResult.Error = project.Error;
            return commandResult;
        }
        
        //TODO: vérifier l'id de file

        var annotation = await _datasetsRepository.CreateOrUpdateAnnotation(saveAnnotationInput);
        if (!annotation.IsSuccess)
        {
            commandResult.Error = annotation.Error;
            return commandResult;
        }
        return annotation;
    }
}