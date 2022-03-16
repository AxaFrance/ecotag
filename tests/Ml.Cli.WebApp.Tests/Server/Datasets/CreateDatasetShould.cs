using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class CreateDatasetShould
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
    [InlineData("Public", "datasetgood","Image", "s666666")]
    public async Task CreateDataset(string classification, string name, string type, string nameIdentifier)
    {
        var result = await InitAndExecute(classification, name, type, nameIdentifier, null);

        var resultOk = result.Result as CreatedResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as string;
        Assert.NotNull(resultValue);
    }

    [Theory]
    [InlineData("Public", "dataset1","Image", "S666666", DatasetsRepository.AlreadyTakenName, null)]
    [InlineData("Public", "ds","Image", "S666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "ds**","Image", "S666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "datasetgood","Bad", "S607718", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Bad", "datasetgood","Text", "S607718", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "datasetgood","Image", "S607718", CreateDatasetCmd.UserNotFound, null)]
    [InlineData("Public", "datasetgood","Image", "S666667", CreateDatasetCmd.UserNotInGroup, null)]
    [InlineData("Public", "datasetgood","Image", "S666667", CreateDatasetCmd.GroupNotFound, "6c5b0cdd-2ade-41c0-ba96-d8b17b8cfe78")]
    public async Task ReturnError_WhenCreateDataset(string classification, string name, string type, string nameIdentifier, string errorKey, string groupId)
    {
        var result = await InitAndExecute(classification, name, type, nameIdentifier, groupId);

        var resultWithError = result.Result as BadRequestObjectResult;
        Assert.NotNull(resultWithError);
        var resultWithErrorValue = resultWithError.Value as ErrorResult;
        Assert.Equal(errorKey, resultWithErrorValue?.Key);
    }

    private static async Task<ActionResult<string>> InitAndExecute(string classification, string name, string type, string nameIdentifier,
        string groupId)
    {
        var groupContext = GroupsControllerTest.GetInMemoryGroupContext();

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

        var datasetContext = GetInMemoryDatasetContext();
        datasetContext.Datasets.Add(new DatasetModel
        {
            Classification = DatasetClassificationEnumeration.Confidential,
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
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }
            ))
        };

        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var createDatasetCmd = new CreateDatasetCmd(groupRepository, datasetsRepository, usersRepository);
        var result = await datasetsController.Create(createDatasetCmd, new DatasetInput()
        {
            Classification = classification,
            Name = name,
            Type = type,
            GroupId = groupId ?? group1.Id.ToString()
        });
        return result;
    }
}