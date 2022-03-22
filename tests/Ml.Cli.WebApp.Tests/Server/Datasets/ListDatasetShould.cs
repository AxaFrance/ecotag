using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class ListDatasetShould
{
    [Theory]
    [InlineData("s666666", false, 1)]
    [InlineData("s666666", null, 2)]
    [InlineData("s666666", true, 1)]
    [InlineData("s666667", true, 0)]
    [InlineData("s666668", true, 0)]
    public async Task ListDataset(string nameIdentifier, bool? locked, int numberResult)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var listDatasetCmd = new ListDatasetCmd(mockResult.DatasetsRepository, mockResult.UsersRepository);
        var datasets = await mockResult.DatasetsController.GetAllDatasets(listDatasetCmd, locked);

        Assert.Equal(numberResult, datasets.Count);
    }
}