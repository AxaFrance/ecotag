using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class GetProjectsShould
{
    [Theory]
    [InlineData("s666666", "11111111-0000-0000-0000-000000000000", "project1")]
    public async Task Should_Get_Project(string nameIdentifier, string searchedId, string expectedProjectName)
    {
        var (group, usersRepository, groupsRepository, projectsRepository, projectsController, context) =
            await CreateProjectShould.InitMockAsync(nameIdentifier);
        
        var getProjectCmd = new GetProjectCmd(projectsRepository, usersRepository);
        projectsController.ControllerContext = new ControllerContext()
        {
            HttpContext = context
        };
        var result = await projectsController.GetProject(getProjectCmd, searchedId);
        var resultOk = result.Result as OkObjectResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as ProjectDataModel;
        Assert.Equal(expectedProjectName, resultValue?.Name);
    }

    [Theory]
    [InlineData("s111111",
        "11111111-0000-0000-0000-000000000000", GetProjectCmd.UserNotFound)]
    [InlineData("s666666",
        "10000000-0000-0000-0000-000000000000", GetProjectCmd.ProjectNotFound)]
    [InlineData("s666667",
        "11111111-0000-0000-0000-000000000000", ProjectsRepository.Forbidden)]
    public async Task Should_Return_Error_On_Get_Project(string nameIdentifier, string searchedId,
        string errorType)
    {
        var (group, usersRepository, groupsRepository, projectsRepository, projectsController, context) =
            await CreateProjectShould.InitMockAsync(nameIdentifier);
        var getProjectCmd = new GetProjectCmd(projectsRepository, usersRepository);
        projectsController.ControllerContext = new ControllerContext()
        {
            HttpContext = context
        };

        var result = await projectsController.GetProject(getProjectCmd, searchedId);
        if (errorType == ProjectsRepository.Forbidden)
        {
            var resultError = result.Result as ForbidResult;
            Assert.NotNull(resultError);
        }
        else
        {
            var resultError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultError);
            var resultErrorValue = resultError.Value as ErrorResult;
            Assert.Equal(errorType, resultErrorValue?.Key);
        }
    }

    [Theory]
    [InlineData("s666666", 2)]
    [InlineData("s666667", 0)]
    public async Task Should_Get_All_projects(string nameIdentifier, int expectedProjectsNumber)
    {
        var (group, usersRepository, groupsRepository, projectsRepository, projectsController, context) =
            await CreateProjectShould.InitMockAsync(nameIdentifier);
        
        var getAllProjectsCmd = new GetAllProjectsCmd(projectsRepository, usersRepository);
        projectsController.ControllerContext = new ControllerContext()
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