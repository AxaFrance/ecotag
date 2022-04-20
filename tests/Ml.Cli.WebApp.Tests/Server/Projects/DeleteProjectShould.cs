using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class DeleteProjectShould
{
    [Theory]
    [InlineData("s666666")]
    public async Task Should_Delete_Project(string nameIdentifier)
    {
        var mockedFileService = new Mock<IFileService>();
        mockedFileService
            .Setup(foo => foo.DeleteAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(true);
        var mockedResult = await DatasetMock.InitMockAsync(nameIdentifier, mockedFileService.Object);
        var deleteProjectCmd = new DeleteProjectCmd(mockedResult.UsersRepository, mockedResult.ProjectsRepository, mockedResult.DatasetsRepository, mockedResult.AnnotationsRepository);
        var result = await mockedResult.ProjectsController.Delete(deleteProjectCmd, mockedResult.Dataset3Project1Id);
        var resultOk = result as OkResult;
        Assert.NotNull(resultOk);
    }
}