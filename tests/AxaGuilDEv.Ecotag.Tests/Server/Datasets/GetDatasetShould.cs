using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Xunit;
using Xunit.Abstractions;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class GetDatasetShould
{
    private readonly ITestOutputHelper _output;

    public GetDatasetShould(ITestOutputHelper output)
    {
        this._output = output;
    }
    
    [Theory]
    [InlineData("s666666")]
    public async Task GetDataset(string nameIdentifier)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var getDatasetCmd = new GetDatasetCmd(mockResult.DatasetsRepository, mockResult.UsersRepository);
        var dataset = await mockResult.DatasetsController.GetDataset(getDatasetCmd, mockResult.Dataset1Id);


        var okResult = dataset.Result as OkObjectResult;
        var getDataset = okResult.Value as GetDataset;
        Assert.NotNull(getDataset);
    }

    [Theory]
    [InlineData("S607718", GetDatasetCmd.UserNotFound)]
    [InlineData("S666667", GetDatasetCmd.UserNotInGroup)]
    public async Task ReturnForbidError_WhenGetDataset(string nameIdentifier, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var getDatasetCmd = new GetDatasetCmd(mockResult.DatasetsRepository, mockResult.UsersRepository);

        var result = await mockResult.DatasetsController.GetDataset(getDatasetCmd, mockResult.Dataset1Id);
        var resultWithError = result.Result as ForbidResult;
        Assert.NotNull(resultWithError);
        _output.WriteLine($"type of error is {errorKey}");
    }

    [Theory]
    [InlineData("s666666", GetDatasetCmd.DatasetNotFound)]
    public async Task ReturnNotFOUnd_WhenGetDataset(string nameIdentifier, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var getDatasetCmd = new GetDatasetCmd(mockResult.DatasetsRepository, mockResult.UsersRepository);

        var result =
            await mockResult.DatasetsController.GetDataset(getDatasetCmd, "10000000-0000-0000-0000-000000000000");
        var resultWithError = result.Result as NotFoundResult;
        Assert.NotNull(resultWithError);
        _output.WriteLine($"type of error is {errorKey}");
    }
}