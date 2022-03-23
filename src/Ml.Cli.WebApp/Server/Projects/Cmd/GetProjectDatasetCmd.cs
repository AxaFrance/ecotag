using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetProjectDatasetCmd
{
    public const string DatasetNotFound = "DatasetNotFound";

    public const string UserNotFound = "UserNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IUsersRepository _usersRepository;
    private readonly IProjectsRepository _projectsRepository;

    public GetProjectDatasetCmd(DatasetsRepository datasetsRepository, IUsersRepository usersRepository, IProjectsRepository projectsRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
    }

    public async Task<ResultWithError<GetDataset, ErrorResult>> ExecuteAsync(string datasetId, string projectId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<GetDataset, ErrorResult>();
        
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);
        
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);
        
        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);
        
        commandResult.Data = await _datasetsRepository.GetDatasetAsync(datasetId);
        return commandResult;
    }
}