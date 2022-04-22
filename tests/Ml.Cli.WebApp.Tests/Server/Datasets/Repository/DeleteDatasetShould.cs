using System;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets.Repository;

public class DeleteDatasetShould
{
    [Fact]
    public async Task Should_Delete_Dataset()
    {
        var datasetMock = await DatasetMock.InitMockAsync("s666666");
        var result = await datasetMock.DatasetsRepository.DeleteDatasetAsync(datasetMock.Dataset1Id);
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);
    }
    
    [Fact]
    public async Task Should_Return_Error_When_Deleting_Dataset()
    {
        var datasetMock = await DatasetMock.InitMockAsync("s666666");
        var result = await datasetMock.DatasetsRepository.DeleteDatasetAsync(new Guid().ToString());
        Assert.False(result.IsSuccess);
        Assert.NotNull(result.Error);
        Assert.Equal(DatasetsRepository.DatasetNotFound, result.Error.Key);
    }
}