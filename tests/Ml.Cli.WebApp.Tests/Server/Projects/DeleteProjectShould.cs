using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class DeleteProjectShould
{
    [Theory]
    [InlineData("s666666")]
    public async Task Should_Delete_Project(string nameIdentifier)
    {
        var mockedResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var deleteProjectCmd = new DeleteProjectCmd(mockedResult.UsersRepository, mockedResult.ProjectsRepository, mockedResult.DatasetsRepository);
        var result = await mockedResult.ProjectsController.Delete(deleteProjectCmd, mockedResult.Dataset3Project1Id);
        var resultOk = result as OkObjectResult;
        Assert.NotNull(resultOk);
    }
}