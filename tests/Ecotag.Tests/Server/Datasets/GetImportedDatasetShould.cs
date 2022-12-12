using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets;
using AxaGuilDEv.Ecotag.Server.Datasets.Cmd;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.FileStorage;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Datasets;

public class GetImportedDatasetShould
{
    [Theory]
    [InlineData("s666666", 2)]
    [InlineData("s111111", 0)]
    public async Task GetImportedDatasets(string nameIdentifier, int nbDatasets)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var mockedTransferService = new Mock<IFileService>();
        mockedTransferService.Setup(foo => foo.GetImportedDatasetsNamesAsync("azureblob://TransferFileStorage/input"))
            .ReturnsAsync(new List<string> { "group2/test1", "group2/test2", "group1/demo" });
        
        var options = Options.Create(new DatasetsSettings() { IsBlobTransferActive = true});
        var getImportedDatasetsCmd =
            new GetImportedDatasetsCmd(mockResult.UsersRepository, mockedTransferService.Object, mockResult.DatasetsRepository, options);
        var datasets = await mockResult.DatasetsController.GetImportedDatasets(getImportedDatasetsCmd);
        
        Assert.Equal(nbDatasets, datasets.Count);
    }
}