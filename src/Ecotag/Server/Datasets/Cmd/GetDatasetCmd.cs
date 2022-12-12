using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

namespace AxaGuilDEv.Ecotag.Server.Datasets.Cmd;

public class GetDatasetCmd
{
    public const string UserNotInGroup = "UserNotInGroup";

    public const string DatasetNotFound = "DatasetNotFound";

    public const string UserNotFound = "UserNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly UsersRepository _usersRepository;

    public GetDatasetCmd(DatasetsRepository datasetsRepository, UsersRepository usersRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<GetDataset, ErrorResult>> ExecuteAsync(string datasetId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<GetDataset, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);

        if (user == null) return commandResult.ReturnError(UserNotFound);
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);

        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        commandResult.Data = await _datasetsRepository.GetDatasetAsync(datasetId);

        return commandResult;
    }
}