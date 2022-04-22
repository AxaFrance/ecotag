using System;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.Repository;

public class DeleteProjectShould
{
    [Fact]
    public async Task Should_Delete_Project()
    {
        var datasetMock = await DatasetMock.InitMockAsync("s666666");
        var result = await datasetMock.ProjectsRepository.DeleteProjectAsync(datasetMock.Dataset3Project1Id);
        Assert.True(result.IsSuccess);
        Assert.True(result.Data);
    }
    
    [Fact]
    public async Task Should_Return_Error_When_Deleting_Project()
    {
        var datasetMock = await DatasetMock.InitMockAsync("s666666");
        var result = await datasetMock.ProjectsRepository.DeleteProjectAsync(new Guid().ToString());
        Assert.False(result.IsSuccess);
        Assert.NotNull(result.Error);
        Assert.Equal(ProjectsRepository.NotFound, result.Error.Key);
    }
}