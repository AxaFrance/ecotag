using System.Threading.Tasks;
using Microsoft.Identity.Client;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetDatasetCmd
{
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
        
        commandResult.Data = await _datasetsRepository.GetDatasetAsync(datasetId);
        
        return commandResult;
    }

    public const string UserNotInGroup = "UserNotInGroup";

    public const string DatasetNotFound = "DatasetNotFound";

    public const string UserNotFound = "UserNotFound";
}