using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetDatasetCmd
{
    public const string UserNotInGroup = "UserNotInGroup";

    public const string DatasetNotFound = "DatasetNotFound";

    public const string UserNotFound = "UserNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IUsersRepository _usersRepository;

    public GetDatasetCmd(DatasetsRepository datasetsRepository, IUsersRepository usersRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<GetDataset, ErrorResult>> ExecuteAsync(string datasetId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<GetDataset, ErrorResult>();
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);

        if (user == null) return commandResult.ReturnError(UserNotFound);

        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);

        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);

        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        commandResult.Data = await _datasetsRepository.GetDatasetAsync(datasetId);

        return commandResult;
    }
}