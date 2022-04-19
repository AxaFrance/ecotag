using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Ml.Cli.WebApp.Tests.Server.Projects;
using Moq;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public record MockResult
{
    public GroupModel Group1 { get; set; }
    public UsersRepository UsersRepository { get; set; }
    public GroupsRepository GroupRepository { get; set; }
    public DatasetsRepository DatasetsRepository { get; set; }
    public DatasetsController DatasetsController { get; set; }
    public string Dataset1Id { get; set; }
    public string Dataset2Id { get; set; }
    public string FileId1 { get; set; }
    public string FileId2 { get; set; }
    public string Dataset3Id { get; set; }
    public string Dataset3Project1Id { get; set; }
    public string Annotation1File1Id { get; set; }
    public ProjectsController ProjectsController { get; set; }
    public AnnotationsController AnnotationsController { get; set; }
    public AnnotationsRepository AnnotationsRepository { get; set; }
    public ProjectsRepository ProjectsRepository { get; set; }
    public DeleteRepository DeleteRepository { get; set; }
    public IList<string> fileIds { get; set; }
}


public record MockService
{
    public Mock<IServiceProvider> ServiceProvider  { get; set; }
    public Mock<IServiceScopeFactory> ServiceScopeFactory{ get; set; }
}
internal static class DatasetMock
{
    
    public static MockService GetMockedServiceProvider<T>(Func<T> datasetContextFunc)
    {
        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider.Setup(foo => foo.GetService(typeof(T))).Returns(datasetContextFunc);
        var serviceScope = new Mock<IServiceScope>();
        serviceScope.Setup(foo => foo.ServiceProvider).Returns(serviceProvider.Object);
        serviceScope.Setup(x => x.ServiceProvider).Returns(serviceProvider.Object);
      var serviceScopeFactory = new Mock<IServiceScopeFactory>();
      serviceScopeFactory
          .Setup(x => x.CreateScope())
          .Returns(serviceScope.Object);
      serviceProvider
          .Setup(x => x.GetService(typeof(IServiceScopeFactory)))
          .Returns(serviceScopeFactory.Object);
        return new MockService { ServiceProvider = serviceProvider, ServiceScopeFactory = serviceScopeFactory};
    }
    public static async Task<MockResult> InitMockAsync(string nameIdentifier, IFileService fileService = null)
    {
        var groupContext = GroupsControllerShould.GetInMemoryGroupContext()();

        var group1 = new GroupModel { Name = "group1" };
        groupContext.Groups.Add(group1);
        var group2 = new GroupModel { Name = "group2" };
        groupContext.Groups.Add(group2);
        await groupContext.SaveChangesAsync();

        var user1 = new UserModel { Email = "test1@gmail.com", NameIdentifier = "s666666" };
        groupContext.Users.Add(user1);
        var user2 = new UserModel { Email = "test2@gmail.com", NameIdentifier = "s666667" };
        groupContext.Users.Add(user2);
        await groupContext.SaveChangesAsync();

        groupContext.GroupUsers.Add(new GroupUsersModel { GroupId = group1.Id, UserId = user1.Id });
        await groupContext.SaveChangesAsync();

        var datasetContextFunc = GetInMemoryDatasetContext();
        var datasetContext = datasetContextFunc();

        var deleteContext = GetInMemoryDeleteContext()();
            
        var dataset1 = new DatasetModel
        {
            Classification = DatasetClassificationEnumeration.Confidential,
            Name = "dataset1",
            Type = DatasetTypeEnumeration.Image,
            CreateDate = DateTime.Now.Ticks,
            CreatorNameIdentifier = "S666666",
            IsLocked = false,
            GroupId = group1.Id
        };
        datasetContext.Datasets.Add(dataset1);
        var dataset2 = new DatasetModel
        {
            Classification = DatasetClassificationEnumeration.Confidential,
            Name = "dataset2",
            Type = DatasetTypeEnumeration.Text,
            CreateDate = DateTime.Now.Ticks,
            CreatorNameIdentifier = "S666666",
            IsLocked = true,
            GroupId = group1.Id
        };
        datasetContext.Datasets.Add(dataset2);
        var dataset3 = new DatasetModel
        {
            Classification = DatasetClassificationEnumeration.Confidential,
            Name = "dataset2",
            Type = DatasetTypeEnumeration.Text,
            CreateDate = DateTime.Now.Ticks,
            CreatorNameIdentifier = "S666666",
            IsLocked = true,
            GroupId = group1.Id
        };
        datasetContext.Datasets.Add(dataset3);
        await datasetContext.SaveChangesAsync();

        deleteContext.Datasets.Add(dataset1);
        deleteContext.Datasets.Add(dataset2);
        deleteContext.Datasets.Add(dataset3);
        await deleteContext.SaveChangesAsync();
        
        var dataset1Id = dataset1.Id;
        var dataset2Id = dataset2.Id;
        var dataset3Id = dataset3.Id;

        var fileModel = new FileModel
        {
            DatasetId = dataset1Id,
            ContentType = "MyContent",
            CreateDate = DateTime.Now.Ticks,
            Name = "demo.png",
            Size = 20,
            CreatorNameIdentifier = "S88888"
        };
        var fileModel2 = new FileModel
        {
            DatasetId = dataset3Id,
            ContentType = "MyContent",
            CreateDate = DateTime.Now.Ticks,
            Name = "demo.png",
            Size = 20,
            CreatorNameIdentifier = "S888888"
        };
        datasetContext.Files.Add(fileModel);
        datasetContext.Files.Add(fileModel2);
        deleteContext.Files.Add(fileModel);
        deleteContext.Files.Add(fileModel2);

        var files = new List<FileModel>();
        for (var i = 0; i < 40; i++)
        {
            var f = new FileModel
            {
                DatasetId = dataset3Id,
                ContentType = "MyContent",
                CreateDate = DateTime.Now.Ticks,
                Name = $"demo{i}.png",
                Size = 20,
                CreatorNameIdentifier = "s666666"
            };
            files.Add(f);
            datasetContext.Files.Add(f);
            deleteContext.Files.Add(f);
        }

        await datasetContext.SaveChangesAsync();
        await deleteContext.SaveChangesAsync();

        var projectModel = new ProjectModel()
        {
            Name = "project1",
            AnnotationType = AnnotationTypeEnumeration.ImageClassifier,
            CreateDate = DateTime.Now.Ticks,
            LabelsJson = JsonSerializer.Serialize(new List<CreateProjectLabelInput>()
                { new() { Color = "#00000", Id = "1", Name = "Cat" } }),
            DatasetId = dataset3Id,
            GroupId = group1.Id,
            CreatorNameIdentifier = "S666666",
            NumberCrossAnnotation = 1,
        };

        var projectContext = CreateProjectShould.GetInMemoryProjectContext();
        projectContext.Projects.Add(projectModel);
        deleteContext.Projects.Add(projectModel);
        await projectContext.SaveChangesAsync();
        await deleteContext.SaveChangesAsync();

        var annotation1File1 = new AnnotationModel
        {
            ExpectedOutput = "{\"label\": \"Cat\"}",
            FileId = files[0].Id,
            TimeStamp = DateTime.Now.Ticks,
            CreatorNameIdentifier = "s666666",
            ProjectId = projectModel.Id
        };
        var annotation2File1 = new AnnotationModel
        {
            ExpectedOutput = "{\"label\": \"Dog\"}",
            FileId = files[0].Id,
            TimeStamp = DateTime.Now.Ticks,
            CreatorNameIdentifier = "s888888",
            ProjectId = projectModel.Id
        };
        var annotation1File2 = new AnnotationModel
        {
            ExpectedOutput = "{\"label\": \"Other\"}",
            FileId = files[1].Id,
            TimeStamp = DateTime.Now.Ticks,
            CreatorNameIdentifier = "s666666",
            ProjectId = projectModel.Id
        };
        datasetContext.Annotations.Add(annotation1File1);
        datasetContext.Annotations.Add(annotation1File2);
        datasetContext.Annotations.Add(annotation2File1);
        await datasetContext.SaveChangesAsync();
        
        deleteContext.Annotations.Add(annotation1File1);
        deleteContext.Annotations.Add(annotation1File2);
        deleteContext.Annotations.Add(annotation2File1);
        await deleteContext.SaveChangesAsync();

        var fileId1 = fileModel.Id;
        var fileId2 = fileModel2.Id;

        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var groupRepository = new GroupsRepository(groupContext, null);
        
        var datasetsRepository = new DatasetsRepository(datasetContext, fileService,
            memoryCache);

        var mockedAnnotationsService  = GetMockedServiceProvider(datasetContextFunc);
        var annotationRepository = new AnnotationsRepository(datasetContext, mockedAnnotationsService.ServiceScopeFactory.Object, memoryCache);
        var projectRepository = new ProjectsRepository(projectContext, memoryCache);
        
        var deleteRepository = new DeleteRepository(deleteContext, fileService);
        
        var controllerContext = ControllerContext(nameIdentifier);
        var datasetsController = new DatasetsController();
        datasetsController.ControllerContext = controllerContext; 
        var projectsController = new ProjectsController();
        projectsController.ControllerContext = controllerContext;
        var annotationsController = new AnnotationsController();
        annotationsController.ControllerContext = controllerContext;
        return new MockResult
        {
            Group1 = group1,
            UsersRepository = usersRepository,
            GroupRepository = groupRepository, DatasetsRepository = datasetsRepository,
            DatasetsController = datasetsController, Dataset1Id = dataset1Id.ToString(),
            Dataset2Id = dataset2Id.ToString(),
            FileId1 = fileId1.ToString(),
            FileId2 = fileId2.ToString(),
            Dataset3Id = dataset3Id.ToString(),
            Dataset3Project1Id = projectModel.Id.ToString(),
            Annotation1File1Id = annotation1File1.Id.ToString(),
            ProjectsController = projectsController,
            AnnotationsController = annotationsController,
            AnnotationsRepository = annotationRepository,
            ProjectsRepository = projectRepository,
            DeleteRepository = deleteRepository,
            fileIds = files.Select(f => f.Id.ToString()).ToList()
        };
    }

    public static ControllerContext ControllerContext(string nameIdentifier)
    {
        var context = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }
            ))
        };
        return new ControllerContext
        {
            HttpContext = context
        };
    }
    public static Func<DatasetContext> GetInMemoryDatasetContext()
    {
        var builder = new DbContextOptionsBuilder<DatasetContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);
        builder
            .UseInMemoryDatabase(databaseName)
            .ConfigureWarnings(x => x.Ignore(InMemoryEventId.TransactionIgnoredWarning));
        DatasetContext DatasetContext()
        {
            var options = builder.Options;
            var datasetContext = new DatasetContext(options);
            datasetContext.Database.EnsureCreated();
            datasetContext.Database.EnsureCreatedAsync();
            return datasetContext;
        }
        return DatasetContext;
    }
    
    public static Func<DeleteContext> GetInMemoryDeleteContext()
    {
        var builder = new DbContextOptionsBuilder<DeleteContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);
        DeleteContext DeleteContext()
        {
            var options = builder.Options;
            var deleteContext = new DeleteContext(options);
            deleteContext.Database.EnsureCreated();
            deleteContext.Database.EnsureCreatedAsync();
            return deleteContext;
        }
        return DeleteContext;
    }
}