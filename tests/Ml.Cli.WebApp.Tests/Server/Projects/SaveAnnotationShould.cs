using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Tests.Server.Datasets;
using Ml.Cli.WebApp.Tests.Server.Groups;
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
        "{\"label\": \"cat\"}", AnnotationsRepository.AnnotationNotFound)]
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
        var (usersRepository, datasetsRepository, projectsRepository, projectsController, context, annotationsRepository) = await InitMockAsync(nameIdentifier);
        projectsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var logger = Mock.Of<ILogger<SaveAnnotationCmd>>();
        var saveAnnotationCmd = new SaveAnnotationCmd(projectsRepository, usersRepository, datasetsRepository, annotationsRepository, logger);
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

    public static async Task<(UsersRepository usersRepository, DatasetsRepository datasetsRepository, ProjectsRepository projectsRepository, AnnotationsController annotationsController, DefaultHttpContext context, AnnotationsRepository annotationsRepository)> InitMockAsync(string nameIdentifier)
    {
        var (_, usersRepository, _, projectsRepository, projectsController, context) =
            await InitMockAnnotationsAsync(nameIdentifier);
        var datasetContextFunc = DatasetMock.GetInMemoryDatasetContext();
        var datasetContext = datasetContextFunc();
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
        var annotationsRepository = new AnnotationsRepository(datasetContext, null, memoryCache);
        return (usersRepository, datasetsRepository, projectsRepository, projectsController, context, annotationsRepository);
    }
    
    public static async
            Task<(GroupModel group, UsersRepository usersRepository, GroupsRepository groupsRepository,
                ProjectsRepository projectsRepository, AnnotationsController annotationsController, DefaultHttpContext context
                )> InitMockAnnotationsAsync(string nameIdentifier)
        {
            var groupContext = GroupsControllerShould.GetInMemoryGroupContext()();

            var group = new GroupModel() { Name = "group", Id = new Guid("10000000-0000-0000-0000-000000000000") };
            groupContext.Groups.Add(group);
            await groupContext.SaveChangesAsync();

            var user1 = new UserModel() { Email = "test@gmail.com", NameIdentifier = "s666666"};
            var user2 = new UserModel() { Email = "test2@gmail.com", NameIdentifier = "s666667" };
            groupContext.Users.Add(user1);
            groupContext.Users.Add(user2);
            await groupContext.SaveChangesAsync();

            groupContext.GroupUsers.Add(new GroupUsersModel { UserId = user1.Id, GroupId = group.Id });
            await groupContext.SaveChangesAsync();

            var projectContext = GetInMemoryProjectContext();
            projectContext.Projects.Add(new ProjectModel
            {
                Id = new Guid("11111111-0000-0000-0000-000000000000"),
                Name = "project1",
                AnnotationType = AnnotationTypeEnumeration.ImageClassifier,
                CreateDate = DateTime.Now.Ticks,
                CreatorNameIdentifier = "s666666",
                NumberCrossAnnotation = 1,
                LabelsJson = "[{\"Name\":\"cat\", \"Color\": \"#008194\", \"Id\": \"#008194\"}]",
                DatasetId = new Guid("10000000-1111-0000-0000-000000000000"),
                GroupId = group.Id
            });
            projectContext.Projects.Add(new ProjectModel
            {
                Name = "project2",
                AnnotationType = AnnotationTypeEnumeration.ImageClassifier,
                CreateDate = DateTime.Now.Ticks,
                CreatorNameIdentifier = "s666666",
                NumberCrossAnnotation = 1,
                LabelsJson = "[{\"Name\":\"cat\", \"Color\": \"#008194\", \"Id\": \"#008194\"}]",
                DatasetId = new Guid(),
                GroupId = group.Id
            });
            await projectContext.SaveChangesAsync();
            
            var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
            var projectsRepository = new ProjectsRepository(projectContext, memoryCache);
            var groupsRepository = new GroupsRepository(groupContext, null);
            var usersRepository = new UsersRepository(groupContext, memoryCache);
            var annotationsController = new AnnotationsController();
            
            var context = new DefaultHttpContext()
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }))
            };
            annotationsController.ControllerContext = new ControllerContext() { HttpContext = context };
            return (group, usersRepository, groupsRepository, projectsRepository, annotationsController, context);
        }
    
    public static ProjectContext GetInMemoryProjectContext()
    {
        var builder = new DbContextOptionsBuilder<ProjectContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var projectContext = new ProjectContext(options);
        projectContext.Database.EnsureCreated();
        projectContext.Database.EnsureCreatedAsync();
        return projectContext;
    }
}