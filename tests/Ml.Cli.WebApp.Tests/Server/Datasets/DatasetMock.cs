using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
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
    public string Dataset3Id { get; set; }
    public string Dataset3Project1Id { get; set; }
    public ProjectsController ProjectsController { get; set; }
    public AnnotationsRepository AnnotationsRepository { get; set; }
    public ProjectsRepository ProjectsRepository { get; set; }
    public IList<string> fileIds { get; set; }
}

internal static class DatasetMock
{
    
    private static Mock<IServiceProvider> GetMockedServiceProvider(DatasetContext datasetContext)
    {
        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider.Setup(foo => foo.GetService(typeof(DatasetContext))).Returns(datasetContext);
        var serviceScope = new Mock<IServiceScope>();
        serviceScope.Setup(foo => foo.ServiceProvider).Returns(serviceProvider.Object);
        var serviceScopeFactory = new Mock<IServiceScopeFactory>();
        serviceScopeFactory.Setup(foo => foo.CreateScope()).Returns(serviceScope.Object);
        serviceProvider.Setup(foo => foo.GetService(typeof(IServiceScopeFactory))).Returns(serviceScopeFactory.Object);
        return serviceProvider;
    }
    public static async Task<MockResult> InitMockAsync(string nameIdentifier, IFileService fileService = null)
    {
        var groupContext = GroupsControllerShould.GetInMemoryGroupContext();

        var group1 = new GroupModel { Name = "group1" };
        groupContext.Groups.Add(group1);
        var group2 = new GroupModel { Name = "group2" };
        groupContext.Groups.Add(group2);
        await groupContext.SaveChangesAsync();

        var user1 = new UserModel { Email = "test1@gmail.com", Subject = "s666666" };
        groupContext.Users.Add(user1);
        var user2 = new UserModel { Email = "test2@gmail.com", Subject = "s666667" };
        groupContext.Users.Add(user2);
        await groupContext.SaveChangesAsync();

        groupContext.GroupUsers.Add(new GroupUsersModel { GroupId = group1.Id, UserId = user1.Id });
        await groupContext.SaveChangesAsync();

        var datasetContext = GetInMemoryDatasetContext();
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
        datasetContext.Files.Add(fileModel);

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
        }
        
        await datasetContext.SaveChangesAsync();

        var projectModel = new ProjectModel()
        {
            Name = "project1",
            AnnotationType = AnnotationTypeEnumeration.ImageClassifier,
            CreateDate = DateTime.Now.Ticks,
            LabelsJson = JsonSerializer.Serialize(new List<CreateProjectLabelInput>()
                { new() { Color = "#00000", Id = "1", Name = "youhou" } }),
            DatasetId = dataset3Id,
            GroupId = group1.Id,
            CreatorNameIdentifier = "S666666",
            NumberCrossAnnotation = 1,
        };

        var projectContext = CreateProjectShould.GetInMemoryProjectContext();
        projectContext.Projects.Add(projectModel);
        await projectContext.SaveChangesAsync();
        
        var fileId1 = fileModel.Id;

        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var groupRepository = new GroupsRepository(groupContext, null);
        
        var datasetsRepository = new DatasetsRepository(datasetContext, fileService,
            memoryCache);

        var serviceProvider = GetMockedServiceProvider(datasetContext);
        var annotationRepository = new AnnotationsRepository(datasetContext, serviceProvider.Object, memoryCache);
        var projectRepository = new ProjectsRepository(projectContext, memoryCache);
        
        var context = new DefaultHttpContext
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }
            ))
        };
        var datasetsController = new DatasetsController();
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var projectsController = new ProjectsController();
        projectsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        return new MockResult
        {
            Group1 = group1,
            UsersRepository = usersRepository,
            GroupRepository = groupRepository, DatasetsRepository = datasetsRepository,
            DatasetsController = datasetsController, Dataset1Id = dataset1Id.ToString(),
            Dataset2Id = dataset2Id.ToString(), FileId1 = fileId1.ToString(),
            Dataset3Id = dataset3Id.ToString(),
            Dataset3Project1Id = projectModel.Id.ToString(),
            ProjectsController = projectsController,
            AnnotationsRepository = annotationRepository,
            ProjectsRepository = projectRepository,
            fileIds = files.Select(f => f.Id.ToString()).ToList()
        };
    }

    public static DatasetContext GetInMemoryDatasetContext()
    {
        var builder = new DbContextOptionsBuilder<DatasetContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var groupContext = new DatasetContext(options);
        groupContext.Database.EnsureCreated();
        groupContext.Database.EnsureCreatedAsync();
        return groupContext;
    }
}