using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.BlobStorage;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class GetImportedDatasetShould
{
    [Theory]
    [InlineData("s666666", 2)]
    [InlineData("s111111", 0)]
    public async Task GetImportedDatasets(string nameIdentifier, int nbDatasets)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var mockedTransferService = new Mock<ITransferService>();
        mockedTransferService.Setup(foo => foo.GetImportedDatasetsNamesAsync("input"))
            .ReturnsAsync(new List<string> { "test1", "test2" });
        
        var getImportedDatasetsCmd =
            new GetImportedDatasetsCmd(mockResult.UsersRepository, mockedTransferService.Object);
        var datasets = await mockResult.DatasetsController.GetImportedDatasets(getImportedDatasetsCmd);
        
        Assert.Equal(nbDatasets, datasets.Count);
    }
}