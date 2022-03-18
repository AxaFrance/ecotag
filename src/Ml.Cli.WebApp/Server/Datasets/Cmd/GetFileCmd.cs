﻿using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetFileCmd
{
    private readonly IUsersRepository _usersRepository;
    private readonly DatasetsRepository _datasetsRepository;
    
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";

    public GetFileCmd(IUsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
    }
    public async Task<ResultWithError<FileDataModel, ErrorResult>> ExecuteAsync(string datasetId, string fileId, string nameIdentifier)
    {
        var commandResult = new ResultWithError<FileDataModel, ErrorResult>();
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

        return await _datasetsRepository.GetFileAsync(datasetId, fileId);
    }

}