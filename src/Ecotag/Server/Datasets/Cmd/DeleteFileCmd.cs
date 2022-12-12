using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

namespace AxaGuilDEv.Ecotag.Server.Datasets.Cmd;

public class DeleteFileCmd
{
    private const string UserNotInGroup = "UserNotInGroup";

    public const string DatasetNotFound = "DatasetNotFound";

    private const string UserNotFound = "UserNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly UsersRepository _usersRepository;

    public DeleteFileCmd(UsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<ResultWithError<bool, ErrorResult>> ExecuteAsync(string datasetId, string fileId,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);

        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var deleteResult = await _datasetsRepository.DeleteFileAsync(datasetId, fileId);

        if (!deleteResult.IsSuccess)
        {
            commandResult.Error = deleteResult.Error;
            return commandResult;
        }

        commandResult.Data = deleteResult.Data;
        return commandResult;
    }
}