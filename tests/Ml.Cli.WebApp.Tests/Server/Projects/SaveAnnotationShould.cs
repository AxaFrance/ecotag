using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class SaveAnnotationShould
{
    [Theory]
    [InlineData(true, "s666666", "{\"label\": \"Cat\"}")]
    public async Task SaveNewAnnotation(bool isNewAnnotation, string nameIdentifier, string expectedOutput)
    {
        var result = await InitMockAndExecuteAsync(isNewAnnotation, nameIdentifier, expectedOutput);
        var resultCreated = result.Result as CreatedResult;
        Assert.NotNull(resultCreated);
        var resultValue = resultCreated.Value as string;
        Assert.NotNull(resultValue);
    }
    
    [Theory]
    [InlineData(false, "s666666", "{\"label\": \"Cat\"}")]
    public async Task SaveUpdateAnnotation(bool isNewAnnotation, string nameIdentifier, string expectedOutput)
    {
        var result = await InitMockAndExecuteAsync(isNewAnnotation, nameIdentifier, expectedOutput);
        var resultNoContent = result.Result as NoContentResult;
        Assert.NotNull(resultNoContent);
    }

    [Theory]
    [InlineData(true, "s666666", "", SaveAnnotationCmd.InvalidModel)]
    [InlineData(true, "s111111", "{\"label\": \"cat\"}", SaveAnnotationCmd.UserNotFound)]
    [InlineData(true, "s666666", "invalidLabelName", SaveAnnotationCmd.InvalidLabels)]
    [InlineData(false, "s666666", "{\"label\": \"Cat\"}", AnnotationsRepository.AnnotationNotFound)]
    public async Task ReturnError_WhenCreateOrUpdateAnnotation(bool isNewAnnotation, string nameIdentifier,
        string expectedOutput, string errorKey)
    {
        var result = await InitMockAndExecuteAsync(isNewAnnotation, nameIdentifier, expectedOutput, errorKey);
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

    public static async Task<ActionResult<string>> InitMockAndExecuteAsync(bool isNewAnnotation, string nameIdentifier, string expectedOutput, string errorKey = null)
    {
        var (projectId, fileId, annotationId, usersRepository, datasetsRepository, projectsRepository, annotationsController, annotationsRepository) = await InitMockAsync(nameIdentifier);
        var logger = Mock.Of<ILogger<SaveAnnotationCmd>>();
        var saveAnnotationCmd = new SaveAnnotationCmd(projectsRepository, usersRepository, datasetsRepository, annotationsRepository, logger);
        ActionResult result;
        if (isNewAnnotation)
        {
            result = await annotationsController.Annotation(saveAnnotationCmd, projectId, fileId, new AnnotationInput()
            {
                ExpectedOutput = expectedOutput
            });
        }
        else
        {
            if (errorKey is AnnotationsRepository.AnnotationNotFound)
            {
                annotationId = new Guid().ToString();
            }
            result = await annotationsController.Annotation(saveAnnotationCmd,projectId, fileId, annotationId, new AnnotationInput()
            {
                ExpectedOutput = expectedOutput
            });
        }
        return result;
    }

    public static async Task<(string projectId, string fileId, string annotationId, UsersRepository UsersRepository, DatasetsRepository DatasetsRepository, ProjectsRepository ProjectsRepository, AnnotationsController AnnotationsController, AnnotationsRepository AnnotationsRepository)> InitMockAsync(string nameIdentifier)
    {
        var mockedFileDataModel = new FileServiceDataModel
        {
            Name = "demo.png",
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
            .Setup(foo => foo.DownloadAsync(It.IsAny<string>()))
            .ReturnsAsync(mockedResult);
        var datasetMock = await DatasetMock.InitMockAsync(nameIdentifier, mockedFileService.Object);
        return (datasetMock.Dataset3Project1Id, datasetMock.FileId2, datasetMock.Annotation1File1Id, datasetMock.UsersRepository, datasetMock.DatasetsRepository, datasetMock.ProjectsRepository, datasetMock.AnnotationsController, datasetMock.AnnotationsRepository);
    }
}