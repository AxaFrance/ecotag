using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class ListDatasetShould
{
    [Theory]
    [InlineData("s666666", DatasetLockedEnumeration.None, 3)]
    [InlineData("s666666", null, 5)]
    [InlineData("s666666", DatasetLockedEnumeration.Locked, 2)]
    [InlineData("s666667", DatasetLockedEnumeration.Locked, 0)]
    [InlineData("s666668", DatasetLockedEnumeration.Locked, 0)]
    public async Task ListDataset(string nameIdentifier, DatasetLockedEnumeration? locked, int numberResult)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var listDatasetCmd = new ListDatasetCmd(mockResult.DatasetsRepository, mockResult.UsersRepository);
        var datasets = await mockResult.DatasetsController.GetAllDatasets(listDatasetCmd, locked);

        Assert.Equal(numberResult, datasets.Count);
    }
}