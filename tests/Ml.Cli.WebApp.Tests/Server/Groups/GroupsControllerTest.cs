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
    public async Task Update_Group(string groupInDatabaseId, string jsonUpdateGroupInput, bool isSuccess, string errorType)
    {
        var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);
        
        var groupContext = GetInMemoryGroupContext();
        groupContext.Groups.Add(new GroupModel { Id = new Guid(groupInDatabaseId), Name = "something" });
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

    [Theory]
    [InlineData(
        "[{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}]",
        "[{\"Id\": \"11000000-0000-0000-0000-000000000000\", \"Email\":\"first@gmail.com\"},{\"Id\": \"11100000-0000-0000-0000-000000000000\", \"Email\":\"second@gmail.com\"},{\"Id\": \"11110000-0000-0000-0000-000000000000\", \"Email\":\"third@gmail.com\"}]",
        "[\"11000000-0000-0000-0000-000000000000\",\"11100000-0000-0000-0000-000000000000\"]",
        "10000000-0000-0000-0000-000000000000",
        "{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"groupName\",\"Users\":[{\"Id\": \"11000000-0000-0000-0000-000000000000\", \"Email\":\"first@gmail.com\"},{\"Id\": \"11100000-0000-0000-0000-000000000000\", \"Email\":\"second@gmail.com\"}]}",
        true,
        ""
    )]
    [InlineData(
        "[{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName1\"}, {\"Id\": \"10000000-0000-0000-0000-000000000001\", \"Name\": \"groupName2\"}]",
        "[]",
        "[]",
        "11111111-0000-0000-0000-000000000000",
        "{}",
        false,
        GetGroupCmd.GroupNotFound
    )]
    public async Task Get_Group(string groupsInDatabase, string usersInDatabase, string strUsersInGroup,
        string searchedId, string strExpectedGroupWithUsers, bool isSuccess, string errorType)
    {
        var groupsList = JsonConvert.DeserializeObject<List<GroupDataModel>>(groupsInDatabase);
        var usersList = JsonConvert.DeserializeObject<List<UserDataModel>>(usersInDatabase);
        var usersInGroup = JsonConvert.DeserializeObject<List<string>>(strUsersInGroup);
        var expectedGroupWithUsers = JsonConvert.DeserializeObject<GroupWithUsersDataModel>(strExpectedGroupWithUsers);
        var groupContext = GetInMemoryGroupContext();
        var usersContext = GetInMemoryUserContext();
        var groupUsersContext = GetInMemoryGroupUsersContext();
        if (groupsList != null)
            foreach (var group in groupsList)
            {
                groupContext.Groups.Add(new GroupModel { Id = new Guid(group.Id), Name = group.Name });
            }

        if (usersList != null)
        {
            foreach (var userDataModel in usersList)
            {
                usersContext.Users.Add(new UserModel { Id = new Guid(userDataModel.Id), Email = userDataModel.Email });
            }
        }

        if (usersInGroup != null)
        {
            foreach (var userId in usersInGroup)
            {
                foreach (var group in groupsList)
                {
                    groupUsersContext.GroupUsers.Add(new GroupUsersModel
                        { Id = new Guid(), GroupId = new Guid(group.Id), UserId = new Guid(userId) });
                }
            }
        }

        await groupContext.SaveChangesAsync();
        await usersContext.SaveChangesAsync();
        await groupUsersContext.SaveChangesAsync();
        
        var groupsRepository = new GroupsRepository(groupContext);
        var usersRepository = new UsersRepository(usersContext);
        var groupUsersRepository = new GroupUsersRepository(groupUsersContext);

        var groupsController = new GroupsController();
        var getGroupCmd = new GetGroupCmd(groupsRepository, groupUsersRepository, usersRepository);

        var result = await groupsController.GetGroup(getGroupCmd, searchedId);
        if (isSuccess)
        {
            var resultOk = result.Result as OkObjectResult;
            Assert.NotNull(resultOk);
            var resultValue = resultOk.Value as GroupWithUsersDataModel;
            var serializedExpectedGroup = JsonConvert.SerializeObject(expectedGroupWithUsers);
            var serializedResultValue = JsonConvert.SerializeObject(resultValue);
            Assert.Equal(serializedExpectedGroup, serializedResultValue);
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