using System;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class DeleteProjectCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly DatasetsRepository _datasetsRepository;
    private readonly AnnotationsRepository _annotationsRepository;
    public const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";

    public DeleteProjectCmd(UsersRepository usersRepository, ProjectsRepository projectsRepository, DatasetsRepository datasetsRepository, AnnotationsRepository annotationsRepository)
    {
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
        _datasetsRepository = datasetsRepository;
        _annotationsRepository = annotationsRepository;
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

        await using var transactionDatasets = await _datasetsRepository.DatasetsContext.Database.BeginTransactionAsync();
        try
        {
            await _annotationsRepository.DeleteAnnotationsByProjectIdAsync(projectId);
            var deletedFilesResult = await _datasetsRepository.DeleteFilesAsync(datasetResult.Id, datasetResult.Files);
            var deletedDatasetResult = await _datasetsRepository.DeleteDatasetAsync(datasetResult.Id);

            var deletedProjectResult = await DeleteProjectAsync(projectId);
            
            if (!deletedFilesResult.IsSuccess || !deletedDatasetResult.IsSuccess || !deletedProjectResult)
            {
                throw new Exception();
            }

            await transactionDatasets.CommitAsync();
        }
        catch (Exception)
        {
            await transactionDatasets.RollbackAsync();
        }

        commandResult.Data = true;
        return commandResult;
    }

    private async Task<bool> DeleteProjectAsync(string projectId)
    {
        await using var transactionProjects = await _projectsRepository.ProjectsContext.Database.BeginTransactionAsync();
        try
        {
            await _projectsRepository.DeleteProjectAsync(projectId);
            await transactionProjects.CommitAsync();
            return true;
        }
        catch (Exception)
        {
            await transactionProjects.RollbackAsync();
            return false;
        }
    }
}