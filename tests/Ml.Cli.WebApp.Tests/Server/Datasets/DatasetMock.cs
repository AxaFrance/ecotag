using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public record MockResult
{
    public GroupModel Group1 { get; set; } 
    public UsersRepository UsersRepository{ get; set; }  
    public GroupsRepository GroupRepository{ get; set; } 
    public DatasetsRepository DatasetsRepository{ get; set; } 
    public DatasetsController DatasetsController{ get; set; } 
    public string Dataset1Id { get; set; }  
    public string Dataset2Id{ get; set; } 
    public string FileId1{ get; set; } 
}

static internal class DatasetMock
{
    public static async Task<MockResult> InitMockAsync(string nameIdentifier, IFileService fileService = null)
    {
        var groupContext = GroupsControllerShould.GetInMemoryGroupContext();

        var group1 = new GroupModel() { Name = "group1" };
        groupContext.Groups.Add(group1);
        var group2 = new GroupModel() { Name = "group2" };
        groupContext.Groups.Add(group2);
        await groupContext.SaveChangesAsync();

        var user1 = new UserModel { Email = "test1@gmail.com", Subject = "s666666" };
        groupContext.Users.Add(user1);
        var user2 = new UserModel { Email = "test2@gmail.com", Subject = "s666667" };
        groupContext.Users.Add(user2);
        await groupContext.SaveChangesAsync();

        groupContext.GroupUsers.Add(new GroupUsersModel() { GroupId = group1.Id, UserId = user1.Id });
        await groupContext.SaveChangesAsync();

        var datasetContext = CreateDatasetShould.GetInMemoryDatasetContext();
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
            GroupId = group1.Id,
        };
        datasetContext.Datasets.Add(dataset2);
        await datasetContext.SaveChangesAsync();
        var dataset1Id = dataset1.Id;
        var dataset2Id = dataset2.Id;

        var fileModel = new FileModel()
        {
            DatasetId = dataset1Id,
            ContentType = "MyContent",
            CreateDate = DateTime.Now.Ticks,
            Name = "demo.png",
            Size = 20,
            CreatorNameIdentifier = "S88888",
        };
        datasetContext.Files.Add(fileModel);
        await datasetContext.SaveChangesAsync();
        var fileId1 = fileModel.Id;

        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var groupRepository = new GroupsRepository(groupContext, null);
        var datasetsRepository = new DatasetsRepository(datasetContext, fileService,
            new MemoryCache(Options.Create(new MemoryCacheOptions())));
        var datasetsController = new DatasetsController();

        var context = new DefaultHttpContext()
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }
            ))
        };
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        return new MockResult()
        {
            Group1 = group1,
            UsersRepository = usersRepository,
            GroupRepository = groupRepository, DatasetsRepository = datasetsRepository,
            DatasetsController = datasetsController, Dataset1Id = dataset1Id.ToString(),
            Dataset2Id = dataset2Id.ToString(), FileId1 = fileId1.ToString()
        };
    }
}