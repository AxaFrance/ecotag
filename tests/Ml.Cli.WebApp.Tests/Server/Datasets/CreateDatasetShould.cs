using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class CreateDatasetShould
{
    public static DatasetContext GetInMemoryDatasetContext()
    {
        var builder = new DbContextOptionsBuilder<DatasetContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var groupContext = new DatasetContext(options);
        groupContext.Database.EnsureCreated();
        groupContext.Database.EnsureCreatedAsync();
        return groupContext;
    }
    
    [Theory]
    [InlineData("Public", "datasetgood","Image", "s666666")]
    public async Task CreateDataset(string classification, string name, string type, string nameIdentifier)
    {
        var result = await InitMockAndExecuteAsync(classification, name, type, nameIdentifier, null);

        var resultOk = result.Result as CreatedResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as string;
        Assert.NotNull(resultValue);
    }

    [Theory]
    [InlineData("Public", "dataset1","Image", "S666666", DatasetsRepository.AlreadyTakenName, null)]
    [InlineData("Public", "ds","Image", "S666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "ds**","Image", "S666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "datasetgood","Bad", "S607718", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Bad", "datasetgood","Text", "S607718", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "datasetgood","Image", "S607718", CreateDatasetCmd.UserNotFound, null)]
    [InlineData("Public", "datasetgood","Image", "S666667", CreateDatasetCmd.UserNotInGroup, null)]
    [InlineData("Public", "datasetgood","Image", "S666667", CreateDatasetCmd.GroupNotFound, "6c5b0cdd-2ade-41c0-ba96-d8b17b8cfe78")]
    public async Task ReturnError_WhenCreateDataset(string classification, string name, string type, string nameIdentifier, string errorKey, string groupId)
    {
        var result = await InitMockAndExecuteAsync(classification, name, type, nameIdentifier, groupId);

        var resultWithError = result.Result as BadRequestObjectResult;
        Assert.NotNull(resultWithError);
        var resultWithErrorValue = resultWithError.Value as ErrorResult;
        Assert.Equal(errorKey, resultWithErrorValue?.Key);
    }

    private static async Task<ActionResult<string>> InitMockAndExecuteAsync(string classification, string name, string type, string nameIdentifier,
        string groupId)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var datasetsController = mockResult.DatasetsController;
        
        var createDatasetCmd = new CreateDatasetCmd(mockResult.GroupRepository, mockResult.DatasetsRepository, mockResult.UsersRepository);
        var result = await datasetsController.Create(createDatasetCmd, new DatasetInput()
        {
            Classification = classification,
            Name = name,
            Type = type,
            GroupId = groupId ?? mockResult.Group1.Id.ToString()
        });
        return result;
    }
}