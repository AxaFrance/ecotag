using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
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
    [InlineData("[\"firstGroupName\",\"secondGroupName\"]")]
    [InlineData("[]")]
    public async Task Get_AllGroups(string groupNamesInDatabase)
    {
        var groupsList = JsonConvert.DeserializeObject<List<string>>(groupNamesInDatabase);

        var groupContext = GetInMemoryGroupContext();

        foreach (var groupName in groupsList)
        {
            groupContext.Groups.Add(new GroupModel { Id = new Guid(), Name = groupName });
        }

        await groupContext.SaveChangesAsync();
        
        var groupsRepository = new GroupsRepository(groupContext);
        var groupsController = new GroupsController();
        var getAllGroupsCmd = new GetAllGroupsCmd(groupsRepository);

        var result = await groupsController.GetAllGroups(getAllGroupsCmd);
        var okObjectResult = result.Result as OkObjectResult;
        Assert.NotNull(okObjectResult);
        var resultList = okObjectResult.Value as List<GroupDataModel>;
        Assert.NotNull(resultList);
        Assert.Equal(resultList.Count, groupsList.Count);
        foreach (var groupName in groupsList)
        {
            Assert.Contains(resultList, resultElement => resultElement.Name.Equals(groupName));
        }
    }

    [Theory]
    [InlineData(
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Users\": [\"10000000-1000-0000-0000-000000000000\"]}",
        true,
        ""
    )]
    [InlineData(
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Users\": [\"10000000-1000-0000-0000-000000000000\",\"10000000-1000-0000-0000-000000000000\"]}",
        false,
        UpdateGroupCmd.UserDuplicate
    )]
    [InlineData(
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Users\": [\"10000000-1000-0000-0000-000000000000\",\"10000000-5000-0000-0000-000000000000\"]}",
        false,
        GroupsRepository.UserNotFound
    )]
    [InlineData(
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Users\": [\"10000000-2000-0000-0000-000000000000\"]}",
        true,
        ""
    )]
    [InlineData(
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Users\": []}",
        true,
        ""
    )]
    [InlineData(
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000001\", \"Users\": []}",
        false,
        GroupsRepository.GroupNotFound
    )]
    public async Task Update_Group(string strGroupDataModel, string usersInDatabase, string jsonUpdateGroupInput,
        bool isSuccess, string errorType)
    {
        var groupDataModel = JsonConvert.DeserializeObject<GroupDataModel>(strGroupDataModel);
        var knownUsers = JsonConvert.DeserializeObject<List<UserDataModel>>(usersInDatabase);
        var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);

        var groupContext = GetInMemoryGroupContext();

        groupContext.Groups.Add(new GroupModel { Id = new Guid(groupDataModel.Id), Name = groupDataModel.Name });

        if (knownUsers != null)
        {
            foreach (var newUser in knownUsers)
            {
                groupContext.Users.Add(new UserModel { Id = new Guid(newUser.Id), Email = newUser.Email.ToLower() });
            }
        }

        await groupContext.SaveChangesAsync();

        var groupsRepository = new GroupsRepository(groupContext);
        var groupsController = new GroupsController();
        var updateGroupCmd = new UpdateGroupCmd(groupsRepository);
        var result = await groupsController.Update(updateGroupCmd, updateGroupInput);
        if (isSuccess)
        {
            var resultOk = result.Result as NoContentResult;
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
    [InlineData("groupName",
        "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
        "[\"10000000-1000-0000-0000-000000000000\",\"10000000-2000-0000-0000-000000000000\"]",
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Users\": []}")]
    public async Task Delete_Users_From_Group(string groupName, string userDataModels, string strUsersInGroup,
        string jsonUpdateGroupInput)
    {
        var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);
        var knownUsers = JsonConvert.DeserializeObject<List<UserDataModel>>(userDataModels);
        var usersInGroup = JsonConvert.DeserializeObject<List<string>>(strUsersInGroup);

        var groupContext = GetInMemoryGroupContext();

        groupContext.Groups.Add(new GroupModel
            { Id = new Guid("10000000-0000-0000-0000-000000000000"), Name = groupName });

        if (knownUsers != null)
        {
            foreach (var newUser in knownUsers)
            {
                groupContext.Users.Add(new UserModel { Id = new Guid(newUser.Id), Email = newUser.Email.ToLower() });
            }
        }

        await groupContext.SaveChangesAsync();

        if (usersInGroup != null)
        {
            foreach (var userId in usersInGroup)
            {
                var userModel = await groupContext.Users.AsNoTracking()
                    .FirstOrDefaultAsync(current => current.Id == new Guid(userId));
                Assert.NotNull(userModel);
                groupContext.GroupUsers.Add(new GroupUsersModel
                {
                    GroupId = new Guid("10000000-0000-0000-0000-000000000000"),
                    UserId = userModel.Id
                });
            }
        }

        await groupContext.SaveChangesAsync();

        var groupsRepository = new GroupsRepository(groupContext);
        var groupsController = new GroupsController();
        var updateGroupCmd = new UpdateGroupCmd(groupsRepository);
        var result = await groupsController.Update(updateGroupCmd, updateGroupInput);

        var resultOk = result.Result as NoContentResult;
        Assert.NotNull(resultOk);
        var updatedGroup = await groupsRepository.GetGroupAsync("10000000-0000-0000-0000-000000000000");
        Assert.Null(updatedGroup.Users);
    }
}
