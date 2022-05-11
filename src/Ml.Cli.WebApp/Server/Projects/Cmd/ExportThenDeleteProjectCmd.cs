using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class ExportThenDeleteProjectCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly DatasetsRepository _datasetsRepository;
    private readonly AnnotationsRepository _annotationsRepository;
    private readonly DeleteRepository _deleteRepository;
    private readonly IFileService _fileService;
    public const string UserNotFound = "UserNotFound";

    public ExportThenDeleteProjectCmd(UsersRepository usersRepository, ProjectsRepository projectsRepository, DatasetsRepository datasetsRepository, AnnotationsRepository annotationsRepository, DeleteRepository deleteRepository, IFileService fileService)
    {
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
        _datasetsRepository = datasetsRepository;
        _annotationsRepository = annotationsRepository;
        _deleteRepository = deleteRepository;
        _fileService = fileService;
    }
    
    public async Task<ResultWithError<bool, ErrorResult>> ExecuteAsync(string projectId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
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

        var datasetResult = await _datasetsRepository.GetDatasetInfoAsync(projectResult.Data.DatasetId);

        var projectDataModel = projectResult.Data;
        var annotations = await _annotationsRepository.GetAnnotationsByProjectIdAndDatasetIdAsync(projectId, projectDataModel.DatasetId);

        var annotationsStatus =
            await _annotationsRepository.AnnotationStatusAsync(projectDataModel.Id, projectDataModel.DatasetId, projectDataModel.NumberCrossAnnotation);
        var exportCmdResult = new GetExportCmdResult
        {
            ProjectName = projectDataModel.Name,
            ProjectType = projectDataModel.AnnotationType,
            DatasetName = datasetResult.Name,
            DatasetType = datasetResult.Type,
            Classification = datasetResult.Classification.ToString(),
            Annotations = annotations,
            NumberAnnotationsDone = annotationsStatus.NumberAnnotationsDone,
            NumberAnnotationsToDo = annotationsStatus.NumberAnnotationsToDo
        };
        
        await UploadProject(exportCmdResult);
        await _deleteRepository.DeleteProjectWithDatasetAsync(datasetResult, projectId);

        commandResult.Data = true;
        return commandResult;
    }

    private async Task UploadProject(GetExportCmdResult exportCmdResult)
    {
        var bytes = JsonSerializer.SerializeToUtf8Bytes(exportCmdResult);
        var containerName = "output";
        var fileName =
            $"{exportCmdResult.ProjectName}_{DateTime.Now.Ticks}/{exportCmdResult.ProjectName}-annotations.json";
        var stream = new MemoryStream(bytes);
        await _fileService.UploadStreamAsync("TransferFileStorage", containerName, fileName, stream);
    }
}