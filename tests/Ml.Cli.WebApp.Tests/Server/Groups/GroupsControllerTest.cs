using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Groups;

public class CreateGroupShould
{
    private static GroupContext GetInMemoryGroupContext()
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

    private static UserContext GetInMemoryUserContext()
    {
        var builder = new DbContextOptionsBuilder<UserContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var userContext = new UserContext(options);
        userContext.Database.EnsureCreated();
        userContext.Database.EnsureCreatedAsync();
        return userContext;
    }

    private static GroupUsersContext GetInMemoryGroupUsersContext()
    {
        var builder = new DbContextOptionsBuilder<GroupUsersContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var groupUsersContext = new GroupUsersContext(options);
        groupUsersContext.Database.EnsureCreated();
        groupUsersContext.Database.EnsureCreatedAsync();
        return groupUsersContext;
    }
    
    [Theory]
    [InlineData("[\"abcd\"]", "abcD", false, CreateGroupCmd.AlreadyTakenName)]
    [InlineData("[]", "ab", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "abc", true, "")]
    [InlineData("[]", "daizidosqdhuzqijodzqoazdjskqldz", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "abcdefgh", true, "")]
    [InlineData("[]", "abd$", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "abcdefghzoiqsdzqosqodz^", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "P$", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "Abcd-dad", true, "")]
    [InlineData("[]", "abdd_O", true, "")]
    [InlineData("[]", "zqdsqd(", false, CreateGroupCmd.InvalidModel)]
    public async Task Create_NewGroup(string groupNamesInDatabase, string groupName, bool isSuccess, string errorType)
    {
        var groupNamesArray = JsonConvert.DeserializeObject<List<string>>(groupNamesInDatabase);
        var groupContext = GetInMemoryGroupContext();
        if (groupNamesArray != null)
            groupNamesArray.ForEach(current =>
                groupContext.Groups.Add(new GroupModel { Id = Guid.NewGuid(), Name = current })
            );
        await groupContext.SaveChangesAsync();
        var newGroup = new CreateGroupInput
        {
            Name = groupName
        };
        var repository = new GroupsRepository(groupContext);
        var groupsController = new GroupsController();
        var createGroupCmd = new CreateGroupCmd(repository);
        var result = await groupsController.Create(createGroupCmd, newGroup);
        if (isSuccess)
        {
            var resultCreated = result.Result as CreatedResult;
            Assert.NotNull(resultCreated);
        }
        else
        {
            var resultWithError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultWithError);
            var resultWithErrorValue = resultWithError.Value as ErrorResult;
            Assert.Equal(errorType, resultWithErrorValue?.Key);
        }
    }

    [Theory]
    [InlineData("10000000-0000-0000-0000-000000000000", "{\"Id\":\"10000000-0000-0000-0000-000000000000\", \"Name\":\"something\", \"Users\": [{\"Id\":\"10000000-0000-0000-0000-000000000001\", \"Email\": \"something@gmail.com\"}]}", true, "")]
    [InlineData("15625896-0000-0000-0000-000000000000", "{\"Id\":\"10000000-0000-0000-0000-000000000000\", \"Name\":\"something\", \"Users\": [{\"Id\":\"10000000-0000-0000-0000-000000000001\", \"Email\": \"something@gmail.com\"}]}", false, UpdateGroupCmd.GroupNotFound)]
    [InlineData("10000000-0000-0000-0000-000000000000", "{\"Id\":\"10000000-0000-0000-0000-000000000000\", \"Name\":\"something\", \"Users\": [{\"Id\":\"10000000-0000-0000-0000-000000000001\", \"Email\": \"unknownUser@gmail.com\"}]}", false, UpdateGroupCmd.UserNotFound)]
    public async Task Update_Group(string groupId, string jsonUpdateGroupInput, bool isSuccess, string errorType)
    {
        var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);
        
        var groupContext = GetInMemoryGroupContext();
        groupContext.Groups.Add(new GroupModel { Id = new Guid(groupId), Name = "something" });
        await groupContext.SaveChangesAsync();

        var userContext = GetInMemoryUserContext();
        userContext.Users.Add(new UserModel { Id = new Guid(updateGroupInput!.Users[0].Id), Email = "something@gmail.com"});
        await userContext.SaveChangesAsync();

        var groupUsersContext = GetInMemoryGroupUsersContext();

        var groupsRepository = new GroupsRepository(groupContext);
        var usersRepository = new UsersRepository(userContext);
        var groupUsersRepository = new GroupUsersRepository(groupUsersContext);
        var groupsController = new GroupsController();
        var updateGroupCmd = new UpdateGroupCmd(groupsRepository, usersRepository, groupUsersRepository);
        var result = await groupsController.Update(updateGroupCmd, updateGroupInput);
        if (isSuccess)
        {
            var resultOk = result.Result as OkObjectResult;
            Assert.NotNull(resultOk);
        }
        else
        {
            var resultWithError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultWithError);
            var resultWithErrorValue = resultWithError.Value as ErrorResult;
            Assert.Equal(errorType, resultWithErrorValue?.Key);
        }
    }
}