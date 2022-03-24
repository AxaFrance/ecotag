using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class SaveAnnotationShould
{
    [Theory]
    [InlineData("null", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s666666", "")]
    public async Task SaveNewAnnotation(string annotationId, string fileId, string projectId, string nameIdentifier, string expectedOutput)
    {
        var result = await InitMockAndExecuteAsync(annotationId, fileId, projectId, nameIdentifier, expectedOutput);
        var resultCreated = result.Result as CreatedResult;
        Assert.NotNull(resultCreated);
        var resultValue = resultCreated.Value as string;
        Assert.NotNull(resultValue);
    }

    public static async Task<ActionResult<string>> InitMockAndExecuteAsync(string annotationId, string fileId, string projectId, string nameIdentifier, string expectedOutput)
    {
        var (usersRepository, datasetsRepository, projectsRepository, projectsController, context) = await InitMockAsync(nameIdentifier);
        projectsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var saveAnnotationCmd = new SaveAnnotationCmd(projectsRepository, usersRepository, datasetsRepository);
        var result = await projectsController.Annotation(saveAnnotationCmd,projectId, fileId, annotationId, new AnnotationInput()
        {
            ExpectedOutput = expectedOutput
        });
        return result;
    }

    public static async Task<(UsersRepository usersRepository, DatasetsRepository datasetsRepository, ProjectsRepository projectsRepository, ProjectsController projectsController, DefaultHttpContext context)> InitMockAsync(string nameIdentifier)
    {
        var (_, usersRepository, _, projectsRepository, projectsController, context) =
            await CreateProjectShould.InitMockAsync(nameIdentifier);
        var datasetContext = DatasetMock.GetInMemoryDatasetContext();
        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var datasetsRepository = new DatasetsRepository(datasetContext, null, memoryCache);

        return (usersRepository, datasetsRepository, projectsRepository, projectsController, context);
    }
}