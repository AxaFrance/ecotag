using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.Annotations;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Projects.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations;

public record GetExportCmdResult
{
    public string ProjectName { get; set; }
    public string ProjectType { get; set; }
    public string DatasetName { get; set; }
    public string DatasetType { get; set; }
    public string Classification { get; set; }
    public int NumberAnnotationsDone { get; set; }
    public int NumberAnnotationsToDo { get; set; }
    public List<ExportAnnotation> Annotations { get; set; }
}

public record ExportAnnotation
{
    public string NameIdentifier { get; set; }
    public long CreateDate { get; set; }
    public string FileName { get; set; }
    public object Annotation { get; set; }
}

public class ExportCmd
{
    public const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly AnnotationsRepository _annotationsRepository;
    private readonly DatasetsRepository _datasetsRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public ExportCmd(UsersRepository usersRepository, ProjectsRepository projectsRepository,
        AnnotationsRepository annotationsRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
        _annotationsRepository = annotationsRepository;
        _datasetsRepository = datasetsRepository;
    }

    public async Task<ResultWithError<GetExportCmdResult, ErrorResult>> ExecuteAsync(string projectId,
        string userNameIdentifier)
    {
        var commandResult = new ResultWithError<GetExportCmdResult, ErrorResult>();

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(userNameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound
            };
            return commandResult;
        }

        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);

        var dataset = await _datasetsRepository.GetDatasetAsync(projectResult.Data.DatasetId);
        if (dataset == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DatasetNotFound
            };
            return commandResult;
        }

        var annotations =
            await _annotationsRepository.GetAnnotationsByProjectIdAndDatasetIdAsync(projectId, dataset.Id);

        var project = projectResult.Data;

        var annotationsStatus =
            await _annotationsRepository.AnnotationStatusAsync(projectId, dataset.Id, project.NumberCrossAnnotation);

        var exportCmdResult = new GetExportCmdResult
        {
            ProjectName = project.Name,
            ProjectType = project.AnnotationType,
            DatasetName = dataset.Name,
            DatasetType = dataset.Type,
            Classification = dataset.Classification,
            Annotations = annotations,
            NumberAnnotationsDone = annotationsStatus.NumberAnnotationsDone,
            NumberAnnotationsToDo = annotationsStatus.NumberAnnotationsToDo
        };
        commandResult.Data = exportCmdResult;
        return commandResult;
    }
}