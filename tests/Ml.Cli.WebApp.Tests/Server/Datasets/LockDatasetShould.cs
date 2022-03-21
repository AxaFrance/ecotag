using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class LockDatasetShould
{

    [Theory]
    [InlineData("s666666")]
    public async Task LockDataset(string nameIdentifier)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        
        var lockDatasetCmd = new LockDatasetCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);
        
        var result = await mockResult.DatasetsController.Lock(lockDatasetCmd, mockResult.Dataset1Id);

        var noContentResult = result as NoContentResult;
        Assert.NotNull(noContentResult);
    }
    
    [Theory]
    [InlineData("s666668", UploadFileCmd.UserNotFound)]
    [InlineData("s666667", UploadFileCmd.UserNotInGroup)]
    public async Task ReturnIsForbidden(string nameIdentifier, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        
        var lockDatasetCmd = new LockDatasetCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);
        var result = await mockResult.DatasetsController.Lock(lockDatasetCmd, mockResult.Dataset1Id);

        var forbidResult = result as ForbidResult;
        Assert.NotNull(forbidResult);
    }
    
    [Theory]
    [InlineData("s666666", "10000000-0000-0000-0000-000000000000", UploadFileCmd.UserNotFound)]
    public async Task ReturnNotFound(string nameIdentifier, string datasetId, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        
        var lockDatasetCmd = new LockDatasetCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);

        var result = await mockResult.DatasetsController.Lock(lockDatasetCmd, datasetId);

        var notFoundResult = result as NotFoundResult;
        Assert.NotNull(notFoundResult);
    }

}