using System;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class DeleteProjectCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly DatasetsRepository _datasetsRepository;
    public const string UserNotFound = "UserNotFound";

    public DeleteProjectCmd(UsersRepository usersRepository, ProjectsRepository projectsRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
        _datasetsRepository = datasetsRepository;
    }
    
    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(string projectId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

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

        await using (var transactionDatasets = _datasetsRepository.DatasetsContext.Database.BeginTransaction())
        {
            //TODO: faire pareil avec files, datasets, annotations et fileblobs
            try
            {
                await using (var transactionProjects = _projectsRepository.ProjectsContext.Database.BeginTransaction())
                {
                    try
                    {
                        await _projectsRepository.DeleteProjectAsync(projectId);
                        await transactionProjects.CommitAsync();
                    }
                    catch (Exception)
                    {
                        await transactionProjects.RollbackAsync();
                        throw;
                    }
                }
            }
            catch (Exception)
            {
                await transactionDatasets.RollbackAsync();
            }
        }
        

        return commandResult;
    }
}