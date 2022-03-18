﻿using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public record UploadFileCmdInput
{
    public string Name { get; set; }
    public string ContentType { get; set; }
    public string DatasetId { get; set; }
    public Stream Stream { get; set; }
    public string NameIdentifier { get; set; }
}


public class UploadFileCmd
{
    private readonly IUsersRepository _usersRepository;
    private readonly DatasetsRepository _datasetsRepository;

    public UploadFileCmd(IUsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
    }
    
    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(UploadFileCmdInput uploadFileCmdInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        
        var validationResult = new Validation().Validate(uploadFileCmdInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var nameIdentifier = uploadFileCmdInput.NameIdentifier;
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
                Error = null
            };
            return commandResult;
        }

        var datasetId = uploadFileCmdInput.DatasetId;

        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);

        if (datasetInfo.IsLocked)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DatasetLocked,
                Error = null
            };
            return commandResult;
        }

        if (!user.GroupIds.Contains(datasetInfo.GroupId.ToString()))
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotInGroup,
                Error = null
            };
            return commandResult;
        }

        var fileName = uploadFileCmdInput.Name;
        var stream = uploadFileCmdInput.Stream;
        

        var fileId = await _datasetsRepository.CreateFileAsync(datasetId, stream, fileName, uploadFileCmdInput.ContentType,
            nameIdentifier);

        commandResult.Data = fileId;
        return commandResult;
    }

    private const string DatasetLocked = "DatasetLocked";

    private const string UserNotInGroup = "UserNotInGroup";

    private const string UserNotFound = "UserNotFound";

    private const string InvalidModel = "InvalidModel";
}