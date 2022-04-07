using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotation;

public class GetAnnotationsStatusCmd
{
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;
    private readonly AnnotationsRepository _annotationsRepository;
    public const string UserNotFound = "UserNotFound";

    public GetAnnotationsStatusCmd(ProjectsRepository projectsRepository, UsersRepository usersRepository, AnnotationsRepository annotationsRepository)
    {
        _projectsRepository = projectsRepository;
        _usersRepository = usersRepository;
        _annotationsRepository = annotationsRepository;
    }

    public async Task<ResultWithError<AnnotationStatus, ErrorResult>> ExecuteAsync(string projectId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<AnnotationStatus, ErrorResult>();
        
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound
            };
            return commandResult;
        }
        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);

        if (!projectResult.IsSuccess)
        {
            return commandResult.ReturnError(projectResult.Error.Key);
        }

        var project = projectResult.Data;

        commandResult.Data =  await _annotationsRepository.AnnotationStatusAsync(projectId, project.DatasetId,
            project.NumberCrossAnnotation);
        
        return commandResult;
    }
}

public record  GetAnnotationsStatusCmdResult
{
    public string Id { get; set; }
    
    public string DatasetId { get; set; }
    
    public string GroupId { get; set; }
    
    public string Name { get; set; }

    public int NumberCrossAnnotation { get; set; }
    
    public long CreateDate { get; set; }
    
    public string AnnotationType { get; set; }

    public List<LabelDataModel> Labels { get; set; }
    
    public string CreatorNameIdentifier { get; set; }
    public AnnotationStatus AnnotationStatus { get; set; }
}