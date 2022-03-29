using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class GetProjectsShould
{
    [Theory]
    [InlineData("s666666", 2)]
    [InlineData("s666667", 0)]
    public async Task Should_Get_All_projects(string nameIdentifier, int expectedProjectsNumber)
    {
        var (group, usersRepository, groupsRepository, projectsRepository, projectsController, context) =
            await CreateProjectShould.InitMockAsync(nameIdentifier);

        var getAllProjectsCmd = new GetAllProjectsCmd(projectsRepository, usersRepository);
        projectsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };

        var result = await projectsController.GetAllProjects(getAllProjectsCmd);
        var okObjectResult = result.Result as OkObjectResult;
        Assert.NotNull(okObjectResult);
        var resultList = okObjectResult.Value as List<ProjectDataModel>;
        Assert.NotNull(resultList);
        Assert.Equal(resultList.Count, expectedProjectsNumber);
    }
}