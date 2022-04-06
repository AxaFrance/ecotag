using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotation;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotation.AnnotationInputValidators;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class SaveAnnotationShould
{
    [Theory]
    [InlineData("null", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s666666", "{\"label\": \"cat\"}")]
    public async Task SaveNewAnnotation(string annotationId, string fileId, string projectId, string nameIdentifier, string expectedOutput)
    {
        var result = await InitMockAndExecuteAsync(annotationId, fileId, projectId, nameIdentifier, expectedOutput);
        var resultCreated = result.Result as CreatedResult;
        Assert.NotNull(resultCreated);
        var resultValue = resultCreated.Value as string;
        Assert.NotNull(resultValue);
    }
    
    [Theory]
    [InlineData("10000000-1111-0000-0000-000000000000", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s666666", "{\"label\": \"cat\"}")]
    public async Task SaveUpdateAnnotation(string annotationId, string fileId, string projectId, string nameIdentifier, string expectedOutput)
    {
        var result = await InitMockAndExecuteAsync(annotationId, fileId, projectId, nameIdentifier, expectedOutput);
        var resultNoContent = result.Result as NoContentResult;
        Assert.NotNull(resultNoContent);
    }

    [Theory]
    [InlineData("null", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s666666",
        "", SaveAnnotationCmd.InvalidModel)]
    [InlineData("null", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s111111",
        "{\"label\": \"cat\"}", SaveAnnotationCmd.UserNotFound)]
    [InlineData("null", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s666666",
        "invalidLabelName", SaveAnnotationCmd.InvalidLabels)]
    [InlineData("11111111-1111-1111-1111-000000000000", "10000000-0000-0000-0000-000000000000", "11111111-0000-0000-0000-000000000000", "s666666",
        "{\"label\": \"cat\"}", DatasetsRepository.AnnotationNotFound)]
    public async Task ReturnError_WhenCreateOrUpdateAnnotation(string annotationId, string fileId, string projectId,
        string nameIdentifier, string expectedOutput, string errorKey)
    {
        var result = await InitMockAndExecuteAsync(annotationId, fileId, projectId, nameIdentifier, expectedOutput);
        if (errorKey == ProjectsRepository.Forbidden)
        {
            var resultForbidden = result.Result as ForbidResult;
            Assert.NotNull(resultForbidden);
        }
        else
        {
            var resultBadRequest = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultBadRequest);
            var resultBadRequestValue = resultBadRequest.Value as ErrorResult;
            Assert.NotNull(resultBadRequestValue);
            Assert.Equal(errorKey, resultBadRequestValue.Key);
        }
    }

    public static async Task<ActionResult<string>> InitMockAndExecuteAsync(string annotationId, string fileId, string projectId, string nameIdentifier, string expectedOutput)
    {
        var (usersRepository, datasetsRepository, projectsRepository, projectsController, context) = await InitMockAsync(nameIdentifier);
        projectsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var logger = Mock.Of<ILogger<SaveAnnotationCmd>>();
        var saveAnnotationCmd = new SaveAnnotationCmd(projectsRepository, usersRepository, datasetsRepository, logger);
        ActionResult result;
        if (annotationId == "null")
        {
            result = await projectsController.Annotation(saveAnnotationCmd,projectId, fileId, new AnnotationInput()
            {
                ExpectedOutput = expectedOutput
            });
        }
        else
        {
            result = await projectsController.Annotation(saveAnnotationCmd,projectId, fileId, annotationId, new AnnotationInput()
            {
                ExpectedOutput = expectedOutput
            });
        }
        return result;
    }

    public static async Task<(UsersRepository usersRepository, DatasetsRepository datasetsRepository, ProjectsRepository projectsRepository, ProjectsController projectsController, DefaultHttpContext context)> InitMockAsync(string nameIdentifier)
    {
        var (_, usersRepository, _, projectsRepository, projectsController, context) =
            await CreateProjectShould.InitMockAsync(nameIdentifier);
        var datasetContext = DatasetMock.GetInMemoryDatasetContext();
        datasetContext.Annotations.Add(new AnnotationModel()
        {
            Id = new Guid("10000000-1111-0000-0000-000000000000"),
            File = new FileModel(),
            ExpectedOutput = "cat",
            FileId = new Guid(),
            ProjectId = new Guid("11111111-0000-0000-0000-000000000000"),
            CreatorNameIdentifier = nameIdentifier,
            TimeStamp = 10000000
        });
        datasetContext.Files.Add(new FileModel()
        {
            Id = new Guid("10000000-0000-0000-0000-000000000000"),
            Name = "testFile.json",
            Size = 1500,
            ContentType = "application/json",
            CreatorNameIdentifier = "s666666",
            CreateDate = 10000000,
            DatasetId = new Guid("10000000-1111-0000-0000-000000000000")
        });
        await datasetContext.SaveChangesAsync();
        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var mockedFileDataModel = new FileServiceDataModel
        {
            Name = "testFile.json",
            Length = 1000,
            Stream = null,
            ContentType = "application/json"
        };
        var mockedResult = new ResultWithError<FileServiceDataModel, ErrorResult>
        {
            Data = mockedFileDataModel
        };
        var mockedFileService = new Mock<IFileService>();
        mockedFileService
            .Setup(foo => foo.DownloadAsync("10000000-1111-0000-0000-000000000000", "testFile.json"))
            .ReturnsAsync(mockedResult);
        var datasetsRepository = new DatasetsRepository(datasetContext, mockedFileService.Object, memoryCache);

        return (usersRepository, datasetsRepository, projectsRepository, projectsController, context);
    }
}