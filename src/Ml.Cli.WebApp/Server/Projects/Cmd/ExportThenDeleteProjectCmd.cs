﻿using System;
using System.IO;
using System.Linq;
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

public class ExportThenDeleteProjectCmd
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

    public ExportThenDeleteProjectCmd(UsersRepository usersRepository, ProjectsRepository projectsRepository, DatasetsRepository datasetsRepository, AnnotationsRepository annotationsRepository, IBlobService blobService)
    {
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
        _datasetsRepository = datasetsRepository;
        _annotationsRepository = annotationsRepository;
        _blobService = blobService;
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

        var datasetResult = await _datasetsRepository.GetDatasetAsync(projectResult.Data.DatasetId);
        if (datasetResult == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DatasetNotFound
            };
            return commandResult;
        }

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
            Classification = datasetResult.Classification,
            Annotations = annotations,
            NumberAnnotationsDone = annotationsStatus.NumberAnnotationsDone,
            NumberAnnotationsToDo = annotationsStatus.NumberAnnotationsToDo
        };

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
                var annotationsTask = _annotationsRepository.DeleteAnnotationsByProjectIdAsync(projectId);
                var reservationsTask = _annotationsRepository.DeleteReservationsByProjectIdAsync(projectId);
                Task.WaitAll(annotationsTask, reservationsTask);
                var deletedProjectResult = await _projectsRepository.DeleteProjectAsync(projectId);
                if (!deletedProjectResult.IsSuccess)
                {
                    commandResult.Error = deletedProjectResult.Error;
                    throw new Exception();
                }
                var isDatasetUsedByOtherProjects =
                    _projectsRepository.IsDatasetUsedByOtherProjects(projectId, datasetResult.Id);
                if (!isDatasetUsedByOtherProjects)
                {
                    var filesIds = datasetResult.Files.Select(file => file.Id.ToString()).ToList();
                    var deletedFilesResult = await _datasetsRepository.DeleteFilesAsync(datasetResult.Id, filesIds);
                    if (!deletedFilesResult.IsSuccess)
                    {
                        commandResult.Error = deletedFilesResult.Error;
                        throw new Exception();
                    }
                    var deletedDatasetResult = await _datasetsRepository.DeleteDatasetAsync(datasetResult.Id);
                    if (!deletedDatasetResult.IsSuccess)
                    {
                        commandResult.Error = deletedDatasetResult.Error;
                        throw new Exception();
                    }
                }

                var uploadedProjectResult = await UploadProject(exportCmdResult);
                if (!uploadedProjectResult.IsSuccess)
                {
                    commandResult.Error = uploadedProjectResult.Error;
                    throw new Exception();
                }
                scope.Complete();
            }
            catch (Exception)
            {
                scope.Dispose();
                if(commandResult.Error.Key == null)
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

    private async Task<ResultWithError<bool, ErrorResult>> UploadProject(GetExportCmdResult exportCmdResult)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();
        try
        {
            var serializedContent = JsonSerializer.Serialize(exportCmdResult);
            var bytes = JsonSerializer.SerializeToUtf8Bytes(serializedContent);
            var stream = new MemoryStream(bytes);
            //await _blobService.UploadStreamAsync(project.DatasetId, fileOutput, stream);
        }
        catch (Exception)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UploadError
            };
            return commandResult;
        }

        commandResult.Data = true;
        return commandResult;
    }
}