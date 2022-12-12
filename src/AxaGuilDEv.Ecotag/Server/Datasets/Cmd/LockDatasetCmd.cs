using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class LockDatasetCmd
{
    public const string UserNotInGroup = "UserNotInGroup";
    public const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly UsersRepository _usersRepository;

    public LockDatasetCmd(UsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
    }

    public async Task<ResultWithError<bool, ErrorResult>> ExecuteAsync(string datasetId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);

        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);

        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var locked = await _datasetsRepository.LockAsync(datasetId);

        commandResult.Data = locked;

        return commandResult;
    }
}