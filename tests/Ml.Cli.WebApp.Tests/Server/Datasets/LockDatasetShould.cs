using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Xunit;
using Xunit.Abstractions;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class LockDatasetShould
{
    private readonly ITestOutputHelper _output;

    public LockDatasetShould(ITestOutputHelper output)
    {
        this._output = output;
    }
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
        _output.WriteLine($"type of error is {errorKey}");
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
        _output.WriteLine($"type of error is {errorKey}");
    }
}