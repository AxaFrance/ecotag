using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class DatasetsControllerShould
{

    private static DatasetContext GetInMemoryDatasetContext()
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
    
    [Theory]
    [InlineData("[\"Guillaume.chervet@gmail.com\",\"Lilian.delouvy@gmail.com\"]")]
    [InlineData("[]")]
    public async Task List_Datastes(string userEmailsInDatabase)
    {
        var usersList = JsonConvert.DeserializeObject<List<string>>(userEmailsInDatabase);

        var groupContext = GroupsControllerTest.GetInMemoryGroupContext();
        foreach (var userEmail in usersList)
        {
            groupContext.Users.Add(new UserModel { Id = new Guid(), Email = userEmail, Subject = "S666666" });
        }
        await groupContext.SaveChangesAsync();
        var datasetContext = GetInMemoryDatasetContext();
        
        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var datasetsRepository = new DatasetsRepository(datasetContext);
        var datasetsController = new DatasetsController();

        var context = new DefaultHttpContext()
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, "S607718"),
                }
            ))
        };
    
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        
        var listDatasetCmd = new ListDatasetCmd(datasetsRepository, usersRepository);
        var datasets = await datasetsController.GetAllDatasets(listDatasetCmd, true);
    }
    
    
    [Theory]
    [InlineData("abcD", "[\"S666666\"]","[\"abcd\"]", "abcD", DatasetsRepository.AlreadyTakenName)]
    [InlineData("abcD", "[\"S666666\"]","[]", "ab", CreateDatasetCmd.InvalidModel)]
    [InlineData("abcD", "[\"S666666\"]","[]", "daizidosqdhuzqijodzqoazdjskqldz", CreateDatasetCmd.InvalidModel)]
    [InlineData("abcD", "[\"S666666\"]","[]", "abd$", CreateDatasetCmd.InvalidModel)]
    [InlineData("abcD", "[\"S666666\"]","[]", "abcdefghzoiqsdzqosqodz^", CreateDatasetCmd.InvalidModel)]
    [InlineData("abcD", "[\"S666666\"]","[]", "P$", CreateDatasetCmd.InvalidModel)]
    [InlineData("abcD", "[\"S666666\"]","[]", "zqdsqd(", CreateDatasetCmd.InvalidModel)]
    public async Task ReturnError_WhenCreateDataset(string groupeName, string userSubjectsInDatabase, string datasetNamesInDatabase, string datasetName, string errorType)
    {
        var groupContext = GroupsControllerTest.GetInMemoryGroupContext();

        var group1 = new GroupModel() { Name = "group1" };
        groupContext.Groups.Add(group1);
        var group2 = new GroupModel() { Name = "group2" };
        groupContext.Groups.Add(group2);
        await groupContext.SaveChangesAsync();

        var user1 = new UserModel { Email = "test1@gmail.com", Subject = "S666666" };
        groupContext.Users.Add(user1);
        await groupContext.SaveChangesAsync();
        
        groupContext.GroupUsers.Add(new GroupUsersModel() {GroupId = group1.Id, UserId = user1.Id });
        await groupContext.SaveChangesAsync();
        
        var datasetContext = GetInMemoryDatasetContext();
        datasetContext.Datasets.Add(new DatasetModel { Classification = DatasetClassificationEnumeration.Confidential,
            Name = "dataset1",
            Type = DatasetTypeEnumeration.Image,
            CreateDate = DateTime.Now.Ticks,
            CreatorNameIdentifier = "S666666",
            IsLocked = false,
            GroupId = group1.Id
            
        });
        await datasetContext.SaveChangesAsync();

        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var groupRepository = new GroupsRepository(groupContext, null);
        var datasetsRepository = new DatasetsRepository(datasetContext);
        var datasetsController = new DatasetsController();

        var context = new DefaultHttpContext()
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, "S607718")
                }
            ))
        };
    
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var createDatasetCmd = new CreateDatasetCmd(groupRepository, datasetsRepository, usersRepository);
        var datasets = await datasetsController.Create(createDatasetCmd, new DatasetInput()
        {
            Classification = "Public",
            Name = "Name",
            Type = "Image",
        });
        
        
    }
}