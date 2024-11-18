using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server;
using AxaGuilDEv.Ecotag.Server.Groups;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Server.Groups.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Oidc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Groups;

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
    [InlineData("more_than_forty_eight_characters_group_name_aaaaa", "s666666", CreateGroupCmd.InvalidModel)]
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

        var user1 = new UserModel { Email = "test1@gmail.com", NameIdentifier = "s666666" };
        var user2 = new UserModel { Email = "test2@gmail.com", NameIdentifier = "s666667" };
        groupContext.Users.Add(user1);
        groupContext.Users.Add(user2);
        await groupContext.SaveChangesAsync();

        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var loggerMock = new Mock<ILogger<UsersRepository>>();
        var usersRepository = new UsersRepository(groupContext, memoryCache, loggerMock.Object);
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