using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Projects.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd;

public class GetProjectDatasetCmd
{
    public const string DatasetNotFound = "DatasetNotFound";

    public const string UserNotFound = "UserNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public GetProjectDatasetCmd(DatasetsRepository datasetsRepository, UsersRepository usersRepository,
        ProjectsRepository projectsRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
        _projectsRepository = projectsRepository;
    }

    public async Task<ResultWithError<GetDataset, ErrorResult>> ExecuteAsync(string datasetId, string projectId,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<GetDataset, ErrorResult>();

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);

        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);

        commandResult.Data = await _datasetsRepository.GetDatasetAsync(datasetId);
        return commandResult;
    }
}