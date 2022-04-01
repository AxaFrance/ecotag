using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Xunit;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotation;
using Ml.Cli.WebApp.Tests.Server.Datasets;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class ExportShould
{
    [Theory]
    [InlineData("s666666")]
    public async Task Should_Export_Project(string nameIdentifier)
    {
        var result = await InitMockAndExecuteAsync(nameIdentifier);

        var resultOk = result.Result as OkObjectResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as GetExportCmdResult;
        Assert.NotNull(resultValue);
        Assert.Equal(3, resultValue.Annotations.Count);
    }

    [Theory]
    [InlineData("s111111", true, ExportCmd.UserNotFound)]
    [InlineData("s666667", false, ProjectsRepository.NotFound)]
    [InlineData("s666667", true, ProjectsRepository.Forbidden)]
    public async Task Should_Return_Error_When_Exporting_Project(string nameIdentifier, bool isExistingProject, string errorKey)
    {
        var (projectId, usersRepository, annotationsRepository, projectsRepository, datasetsRepository, projectsController) =
            await InitMockAsync(nameIdentifier);
        if (!isExistingProject)
        {
            var tempProjectId = new Guid().ToString();
            while (tempProjectId.Equals(projectId))
            {
                tempProjectId = new Guid().ToString();
            }

            projectId = tempProjectId;
        }

        var exportCmd = new ExportCmd(usersRepository, projectsRepository, annotationsRepository, datasetsRepository);
        var result = await projectsController.Export(exportCmd, projectId);
        
        if (errorKey == ProjectsRepository.Forbidden)
        {
            var resultForbidden = result.Result as ForbidResult;
            Assert.NotNull(resultForbidden);
        }
        else
        {
            var resultError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultError);
            var resultWithErrorValue = resultError.Value as ErrorResult;
            Assert.Equal(errorKey, resultWithErrorValue?.Key);
        }
    }

    private static async Task<ActionResult<GetExportCmdResult>> InitMockAndExecuteAsync(string nameIdentifier)
    {
        var (projectId, usersRepository, annotationsRepository, projectsRepository, datasetsRepository, projectsController) =
            await InitMockAsync(nameIdentifier);
        var exportCmd = new ExportCmd(usersRepository, projectsRepository, annotationsRepository, datasetsRepository);
        var result = await projectsController.Export(exportCmd, projectId);
        return result;
    }

    private static async
        Task<(string projectId, UsersRepository usersRepository, AnnotationsRepository annotationsRepository, ProjectsRepository projectsRepository, DatasetsRepository datasetsRepository, ProjectsController)> InitMockAsync(string nameIdentifier)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        return (mockResult.Dataset3Project1Id, mockResult.UsersRepository, mockResult.AnnotationsRepository, mockResult.ProjectsRepository, mockResult.DatasetsRepository, mockResult.ProjectsController);
    }
}