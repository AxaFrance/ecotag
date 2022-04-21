using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using System.Transactions;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.BlobStorage;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class DeleteProjectCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly DatasetsRepository _datasetsRepository;
    private readonly AnnotationsRepository _annotationsRepository;
    private readonly IBlobService _blobService;
    public const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    public const string UploadError = "UploadError";
    public const string DeletionFailed = "DeletionFailed";

    public DeleteProjectCmd(UsersRepository usersRepository, ProjectsRepository projectsRepository, DatasetsRepository datasetsRepository, AnnotationsRepository annotationsRepository, IBlobService blobService)
    {
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
        _datasetsRepository = datasetsRepository;
        _annotationsRepository = annotationsRepository;
        _blobService = blobService;
    }
    
    public async Task<ResultWithError<bool, ErrorResult>> ExecuteAsync(ExportCmd exportCmd, string projectId, string nameIdentifier)
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

        var datasetResult = await _datasetsRepository.GetDatasetAsync(projectResult.Data.DatasetId);
        if (datasetResult == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DatasetNotFound
            };
            return commandResult;
        }
        
        /*var exportResult = await ExportProject(exportCmd, projectResult.Data, nameIdentifier);
        if (!exportResult.IsSuccess)
        {
            commandResult.Error = exportResult.Error;
            return commandResult;
        }*/

        var transactionOptions = new TransactionOptions()
        {
            IsolationLevel = IsolationLevel.ReadCommitted,
            Timeout = TransactionManager.MaximumTimeout
        };

        using (var scope = new TransactionScope(TransactionScopeOption.Required, transactionOptions,
                   TransactionScopeAsyncFlowOption.Enabled))
        {
            try
            {
                await _annotationsRepository.DeleteAnnotationsByProjectIdAsync(projectId);
                await _annotationsRepository.DeleteReservationsByProjectIdAsync(projectId);
                var deletedProjectResult = await _projectsRepository.DeleteProjectAsync(projectId);
                if (!deletedProjectResult.IsSuccess)
                {
                    throw new Exception();
                }
                var isDatasetUsedByOtherProjects =
                    _projectsRepository.IsDatasetUsedByOtherProjects(projectId, datasetResult.Id);
                if (!isDatasetUsedByOtherProjects)
                {
                    var deletedFilesResult = await _datasetsRepository.DeleteFilesAsync(datasetResult.Id, datasetResult.Files);
                    var deletedDatasetResult = await _datasetsRepository.DeleteDatasetAsync(datasetResult.Id);
                    if (!deletedFilesResult.IsSuccess || !deletedDatasetResult.IsSuccess)
                    {
                        throw new Exception();
                    }
                }
                scope.Complete();
            }
            catch (Exception)
            {
                scope.Dispose();
                commandResult.Error = new ErrorResult
                {
                    Key = DeletionFailed
                };
                return commandResult;
            }
        }

        commandResult.Data = true;
        return commandResult;
    }

    private async Task<ResultWithError<bool, ErrorResult>> ExportProject(ExportCmd exportCmd, ProjectDataModel project,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();
        var exportResult = await exportCmd.ExecuteAsync(project.Id, nameIdentifier);
        if (!exportResult.IsSuccess)
        {
            commandResult.Error = exportResult.Error;
            return commandResult;
        }

        var fileOutput = "/output/" + project.Name + "_" + DateTime.Now.Ticks + "/" + project.Name +
                         "-annotations.json";
        try
        {
            var serializedContent = JsonSerializer.Serialize(exportResult.Data);
            var bytes = JsonSerializer.SerializeToUtf8Bytes(serializedContent);
            var stream = new MemoryStream(bytes);
            await _blobService.UploadStreamAsync(project.DatasetId, fileOutput, stream);
        }
        catch (Exception e)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UploadError,
                Error = e
            };
            return commandResult;
        }
        
        commandResult.Data = true;
        return commandResult;
    }
}