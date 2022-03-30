using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Oidc;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Groups;

public class CreateGroupShould

{
    public static GroupContext GetInMemoryGroupContext()
    {
        var builder = new DbContextOptionsBuilder<GroupContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var groupContext = new GroupContext(options);
        groupContext.Database.EnsureCreated();
        groupContext.Database.EnsureCreatedAsync();
        return groupContext;
    }

    [Theory]
    [InlineData("newGroup", "s666666")]
    public async Task CreateGroup(string name, string nameIdentifier)
    {
        var result = await InitMockAndExecuteAsync(name, nameIdentifier);

        var resultOk = result.Result as CreatedResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as string;
        Assert.NotNull(resultValue);
    }

    [Theory]
    [InlineData("a", "s666666", CreateGroupCmd.InvalidModel)]
    [InlineData("too_long_group_name", "s666666", CreateGroupCmd.InvalidModel)]
    [InlineData("abd$", "s666666", CreateGroupCmd.InvalidModel)]
    [InlineData("abcdef(", "s666666", CreateGroupCmd.InvalidModel)]
    [InlineData("group1", "s666666", GroupsRepository.AlreadyTakenName)]
    [InlineData("newGroup", "s111111", CreateGroupCmd.UserNotFound)]
    public async Task ReturnError_WhenCreateGroup(string name, string nameIdentifier, string errorKey)
    {
        var result = await InitMockAndExecuteAsync(name, nameIdentifier);

        var resultWithError = result.Result as BadRequestObjectResult;
        Assert.NotNull(resultWithError);
        var resultWithErrorValue = resultWithError.Value as ErrorResult;
        Assert.Equal(errorKey, resultWithErrorValue?.Key);
    }
    
    private static async Task<ActionResult<string>> InitMockAndExecuteAsync(string name, string nameIdentifier)
    {
        var (groupsRepository, usersRepository, groupsController, context) = await InitMockAsync(nameIdentifier);

        groupsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var createGroupCmd = new CreateGroupCmd(groupsRepository, usersRepository);
        var result = await groupsController.Create(createGroupCmd, new GroupInput()
        {
            Name = name,
            UserIds = new List<string>()
        });
        return result;
    }

    public static async Task<(GroupsRepository groupsRepository, UsersRepository usersRepository, GroupsController groupsController, DefaultHttpContext context)> InitMockAsync(
        string nameIdentifier)
    {
        var groupContext = GetInMemoryGroupContext();

        var group1 = new GroupModel() { Name = "group1" };
        var group2 = new GroupModel() { Name = "group2" };
        groupContext.Add(group1);
        groupContext.Add(group2);
        await groupContext.SaveChangesAsync();

        var user1 = new UserModel { Email = "test1@gmail.com", Subject = "s666666" };
        var user2 = new UserModel { Email = "test2@gmail.com", Subject = "s666667" };
        groupContext.Users.Add(user1);
        groupContext.Users.Add(user2);
        await groupContext.SaveChangesAsync();

        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var groupsRepository = new GroupsRepository(groupContext, null);
        var groupsController = new GroupsController();

        var context = new DefaultHttpContext()
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
            }))
        };
        return (groupsRepository, usersRepository, groupsController, context);
    }
}