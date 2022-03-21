using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class DeleteFileCmd
{
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IUsersRepository _usersRepository;

    public DeleteFileCmd(IUsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }
    
    public async Task<ResultWithError<bool, ErrorResult>> ExecuteAsync(string datasetId, string fileId, string nameIdentifier)
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

        var deleteResult = await _datasetsRepository.DeleteFileAsync(datasetId, fileId);

        if (!deleteResult.IsSuccess)
        {
            commandResult.Error = deleteResult.Error;
            return commandResult;
        }

        commandResult.Data = deleteResult.Data;
        return commandResult;
    }

    private const string UserNotInGroup = "UserNotInGroup";

    public const string DatasetNotFound = "DatasetNotFound";

    private const string UserNotFound = "UserNotFound";
}