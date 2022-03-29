using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetProjectCmd
{
    private readonly IProjectsRepository _projectsRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly AnnotationsRepository _annotationsRepository;
    public const string UserNotFound = "UserNotFound";
    public const string ProjectNotFound = "ProjectNotFound";

    public GetProjectCmd(IProjectsRepository projectsRepository, IUsersRepository usersRepository, AnnotationsRepository annotationsRepository)
    {
        _projectsRepository = projectsRepository;
        _usersRepository = usersRepository;
        _annotationsRepository = annotationsRepository;
    }

    public async Task<ResultWithError<GetProjectCmdResult, ErrorResult>> ExecuteAsync(string projectId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<GetProjectCmdResult, ErrorResult>();
        
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
        var getProjectCmdResult = new GetProjectCmdResult
        {
            Id = project.Id,
            Labels = project.Labels,
            Name = project.Name,
            AnnotationType = project.AnnotationType,
            CreateDate = project.CreateDate,
            DatasetId = project.DatasetId,
            GroupId = project.GroupId,
            CreatorNameIdentifier = project.CreatorNameIdentifier,
            NumberCrossAnnotation = project.NumberCrossAnnotation
        };

        var datasetId = project.DatasetId;
        var numberCrossAnnotation = project.NumberCrossAnnotation;
        
        var annotationStatus =  await _annotationsRepository.AnnotationStatusAsync(projectId, project.DatasetId,
            project.NumberCrossAnnotation);
        
        getProjectCmdResult.AnnotationStatus = annotationStatus;
        
        commandResult.Data = getProjectCmdResult;
        return commandResult;
    }
}

public record  GetProjectCmdResult
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