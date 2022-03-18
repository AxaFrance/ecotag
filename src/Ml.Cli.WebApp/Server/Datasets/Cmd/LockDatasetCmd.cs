using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class LockDatasetCmd
{
    private readonly IUsersRepository _usersRepository;
    private readonly DatasetsRepository _datasetsRepository;
    
    public const string UserNotInGroup = "UserNotInGroup";
    public const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";

    public LockDatasetCmd(IUsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
    }
    public async Task<ResultWithError<bool, ErrorResult>> ExecuteAsync(string datasetId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<bool, ErrorResult>();
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
            };
            return commandResult;
        }

        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);

        if (datasetInfo == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DatasetNotFound,
            };
            return commandResult;
        }

        if (!user.GroupIds.Contains(datasetInfo.GroupId))
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotInGroup,
            };
            return commandResult;
        }

        var locked = await _datasetsRepository.Lock(datasetId);

        commandResult.Data = locked;

        return commandResult;
    }
    
}