using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server;
using AxaGuilDEv.Ecotag.Server.Audits;
using AxaGuilDEv.Ecotag.Server.Groups;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Server.Groups.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;
using AxaGuilDEv.Ecotag.Server.Groups.Database.GroupUsers;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Oidc;
using AxaGuilDEv.Ecotag.Tests.Server.Datasets;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Groups;

public class GroupsControllerShould
{
    public static Func<GroupContext> GetInMemoryGroupContext()
    {
        var builder = new DbContextOptionsBuilder<GroupContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);
        GroupContext GroupContext()
        {
            var options = builder.Options;
            var groupContext = new GroupContext(options);
            groupContext.Database.EnsureCreated();
            groupContext.Database.EnsureCreatedAsync();
            return groupContext;
        }
        return GroupContext;
    }

    [Theory]
    [InlineData("[\"firstGroupName\",\"secondGroupName\"]", "s666666")]
    [InlineData("[]", "s666667")]
    [InlineData("[]", "s666665")]
    public async Task ListGroups(string groupNamesInDatabase, string nameIdentifier)
    {
        var groupsList = JsonConvert.DeserializeObject<List<string>>(groupNamesInDatabase);

        var groupContextFunc = GetInMemoryGroupContext();
        var groupContext = groupContextFunc();

        var user1 = new UserModel { Email = "test1@gmail.com", NameIdentifier = "s666666" };
        groupContext.Users.Add(user1);
        var user2 = new UserModel { Email = "test2@gmail.com", NameIdentifier = "s666667" };
        groupContext.Users.Add(user2);
        
        foreach (var groupName in groupsList)
        {
            var group = new GroupModel { Id = new Guid(), Name = groupName };
            groupContext.Groups.Add(group);
            groupContext.GroupUsers.Add(new GroupUsersModel() { Group = group, User = user1 });
        }
        
        await groupContext.SaveChangesAsync();
        
        var mockedService = DatasetMock.GetMockedServiceProvider(groupContextFunc);
        var groupsRepository = new GroupsRepository(groupContext, mockedService.ServiceScopeFactory.Object);
        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var loggerMock = new Mock<ILogger<UsersRepository>>();
        var usersRepository = new UsersRepository(groupContext, memoryCache, loggerMock.Object);
        var context = new DefaultHttpContext()
        {
            User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }
            ))
        };
        
        var groupsController = new GroupsController();
        groupsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        
        var getAllGroupsCmd = new GetAllGroupsCmd(groupsRepository, usersRepository);

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

    public class GetGroupTests
    {
        private static async Task<Func<GroupContext>> GetGroupContext(List<GroupDataModel> groupsList, List<UserDataModelWithGroups> usersList, List<string> usersInGroup)
        {
            var datasetContextFunc = GetInMemoryGroupContext();
            var groupContext = datasetContextFunc();
            if (groupsList != null)
                foreach (var group in groupsList)
                {
                    groupContext.Groups.Add(new GroupModel { Id = new Guid(group.Id), Name = group.Name });
                }
            
            if (usersList != null)
            {
                foreach (var userDataModel in usersList)
                {
                    groupContext.Users.Add(new UserModel { Id = new Guid(userDataModel.Id), Email = userDataModel.Email, NameIdentifier = "S666666" });
                }
            }

            if (usersInGroup != null)
            {
                foreach (var userId in usersInGroup)
                {
                    foreach (var group in groupsList)
                    {
                        groupContext.GroupUsers.Add(new GroupUsersModel
                            { GroupId = new Guid(group.Id), UserId = new Guid(userId) });
                    }
                }
            }

            await groupContext.SaveChangesAsync();
            return datasetContextFunc;
        }
        
        [Theory]
        [InlineData(
            "[{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}]",
            "[{\"Id\": \"11000000-0000-0000-0000-000000000000\", \"Email\":\"first@gmail.com\"},{\"Id\": \"11100000-0000-0000-0000-000000000000\", \"Email\":\"second@gmail.com\"},{\"Id\": \"11110000-0000-0000-0000-000000000000\", \"Email\":\"third@gmail.com\"}]",
            "[\"11000000-0000-0000-0000-000000000000\",\"11100000-0000-0000-0000-000000000000\"]",
            "10000000-0000-0000-0000-000000000000",
            "{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"groupName\",\"UserIds\":[\"11000000-0000-0000-0000-000000000000\",\"11100000-0000-0000-0000-000000000000\"]}"
        )]
        public async Task Should_Get_Group(string groupsInDatabase, string usersInDatabase, string strUsersInGroup,
            string searchedId, string strExpectedGroupWithUsers)
        {
            var groupsList = JsonConvert.DeserializeObject<List<GroupDataModel>>(groupsInDatabase);
            var usersList = JsonConvert.DeserializeObject<List<UserDataModelWithGroups>>(usersInDatabase);
            var usersInGroup = JsonConvert.DeserializeObject<List<string>>(strUsersInGroup);
            var expectedGroupWithUsers = JsonConvert.DeserializeObject<GroupDataModel>(strExpectedGroupWithUsers);
            var groupContextFunc = await GetGroupContext(groupsList, usersList, usersInGroup);

            var mockedService = DatasetMock.GetMockedServiceProvider(groupContextFunc);
            var groupsRepository = new GroupsRepository(groupContextFunc(), mockedService.ServiceScopeFactory.Object);

            var groupsController = new GroupsController();
            var getGroupCmd = new GetGroupCmd(groupsRepository);

            var result = await groupsController.GetGroup(getGroupCmd, searchedId);
            var resultOk = result.Result as OkObjectResult;
            Assert.NotNull(resultOk);
            var resultValue = resultOk.Value as GroupDataModel;
            var serializedExpectedGroup = JsonConvert.SerializeObject(expectedGroupWithUsers);
            var serializedResultValue = JsonConvert.SerializeObject(resultValue);
            Assert.Equal(serializedExpectedGroup, serializedResultValue);
        }
        
        [Theory]
        [InlineData(
            "[{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName1\"}, {\"Id\": \"10000000-0000-0000-0000-000000000001\", \"Name\": \"groupName2\"}]",
            "[]",
            "[]",
            "11111111-0000-0000-0000-000000000000",
            GetGroupCmd.GroupNotFound
        )]
        public async Task Should_Return_Error_On_Get_Group(string groupsInDatabase, string usersInDatabase, string strUsersInGroup,
            string searchedId, string errorType)
        {
            var groupsList = JsonConvert.DeserializeObject<List<GroupDataModel>>(groupsInDatabase);
            var usersList = JsonConvert.DeserializeObject<List<UserDataModelWithGroups>>(usersInDatabase);
            var usersInGroup = JsonConvert.DeserializeObject<List<string>>(strUsersInGroup);
            var groupContextFunc = await GetGroupContext(groupsList, usersList, usersInGroup);

            var mockedService = DatasetMock.GetMockedServiceProvider(groupContextFunc);
            var groupsRepository = new GroupsRepository(groupContextFunc(), mockedService.ServiceScopeFactory.Object);

            var groupsController = new GroupsController();
            var getGroupCmd = new GetGroupCmd(groupsRepository);

            var result = await groupsController.GetGroup(getGroupCmd, searchedId);
            var resultWithError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultWithError);
            var resultWithErrorValue = resultWithError.Value as ErrorResult;
            Assert.Equal(errorType, resultWithErrorValue?.Key);
        }
    }

    public class UpdateGroupTests
    {
        private static async Task<Func<GroupContext>> GetGroupContext(GroupDataModel groupDataModel, List<UserDataModelWithGroups> knownUsers)
        {
            var groupContextFunc = GetInMemoryGroupContext();
            var groupContext = groupContextFunc();
            
            groupContext.Groups.Add(new GroupModel { Id = new Guid(groupDataModel.Id), Name = groupDataModel.Name });

            if (knownUsers != null)
            {
                foreach (var newUser in knownUsers)
                {
                    groupContext.Users.Add(new UserModel { Id = new Guid(newUser.Id), Email = newUser.Email.ToLower(), NameIdentifier = "S666666" });
                }
            }

            await groupContext.SaveChangesAsync();
            return groupContextFunc;
        }

        [Theory]
        [InlineData(
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
            "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"UserIds\": [\"10000000-1000-0000-0000-000000000000\"]}"
        )]
        [InlineData(
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
            "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"UserIds\": [\"10000000-2000-0000-0000-000000000000\"]}"
        )]
        [InlineData(
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
            "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"UserIds\": []}"
        )]
        public async Task Should_Update_Group(string strGroupDataModel, string usersInDatabase,
            string jsonUpdateGroupInput)
        {
            var groupDataModel = JsonConvert.DeserializeObject<GroupDataModel>(strGroupDataModel);
            var knownUsers = JsonConvert.DeserializeObject<List<UserDataModelWithGroups>>(usersInDatabase);
            var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);
            
            var groupContextFunc = await GetGroupContext(groupDataModel, knownUsers);
            var mockedService = DatasetMock.GetMockedServiceProvider(groupContextFunc);
            
            var groupsRepository = new GroupsRepository(groupContextFunc(), mockedService.ServiceScopeFactory.Object);
            var queue = new Queue();
            var groupsController = new GroupsController();
            groupsController.ControllerContext = DatasetMock.ControllerContext("S777777");
            var updateGroupCmd = new UpdateGroupCmd(groupsRepository, queue);
            
            var result = await groupsController.Update(updateGroupCmd, updateGroupInput);
            var resultOk = result.Result as NoContentResult;
            Assert.NotNull(resultOk);
        }

        [Theory]
        [InlineData(
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
            "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"UserIds\": [\"10000000-1000-0000-0000-000000000000\",\"10000000-1000-0000-0000-000000000000\"]}",
            UpdateGroupCmd.UserDuplicate
        )]
        [InlineData(
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
            "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"UserIds\": [\"10000000-1000-0000-0000-000000000000\",\"10000000-5000-0000-0000-000000000000\"]}",
            GroupsRepository.UserNotFound
        )]
    
        [InlineData(
            "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"Name\": \"groupName\"}",
            "[{\"Id\":\"10000000-1000-0000-0000-000000000000\", \"Email\": \"Guillaume.chervet@gmail.com\"},{\"Id\": \"10000000-2000-0000-0000-000000000000\", \"Email\": \"Lilian.delouvy@gmail.com\"}]",
            "{\"Id\": \"10000000-0000-0000-0000-000000000001\", \"UserIds\": []}",
            GroupsRepository.GroupNotFound
        )]
        public async Task Should_Return_Error_On_Update_Group(string strGroupDataModel, string usersInDatabase,
            string jsonUpdateGroupInput, string errorType)
        {
            var groupDataModel = JsonConvert.DeserializeObject<GroupDataModel>(strGroupDataModel);
            var knownUsers = JsonConvert.DeserializeObject<List<UserDataModelWithGroups>>(usersInDatabase);
            var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);

            var groupContextFunc = await GetGroupContext(groupDataModel, knownUsers);

            var mockedService = DatasetMock.GetMockedServiceProvider(groupContextFunc);

            var controllerContext = DatasetMock.ControllerContext("s777777");
            var groupsRepository = new GroupsRepository(groupContextFunc(), mockedService.ServiceScopeFactory.Object);
            var groupsController = new GroupsController();
            groupsController.ControllerContext = controllerContext;
            
            var queue = new Queue();
            var updateGroupCmd = new UpdateGroupCmd(groupsRepository, queue);
            var result = await groupsController.Update(updateGroupCmd, updateGroupInput);
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
        "{\"Id\": \"10000000-0000-0000-0000-000000000000\", \"UserIds\": []}")]
    public async Task Delete_Users_From_Group(string groupName, string userDataModels, string strUsersInGroup,
        string jsonUpdateGroupInput)
    {
        var updateGroupInput = JsonConvert.DeserializeObject<UpdateGroupInput>(jsonUpdateGroupInput);
        var knownUsers = JsonConvert.DeserializeObject<List<UserDataModelWithGroups>>(userDataModels);
        var usersInGroup = JsonConvert.DeserializeObject<List<string>>(strUsersInGroup);

        var groupContextFunc = GetInMemoryGroupContext();
        var groupContext = groupContextFunc();

        groupContext.Groups.Add(new GroupModel
            { Id = new Guid("10000000-0000-0000-0000-000000000000"), Name = groupName });

        if (knownUsers != null)
        {
            foreach (var newUser in knownUsers)
            {
                groupContext.Users.Add(new UserModel { Id = new Guid(newUser.Id), Email = newUser.Email.ToLower(), NameIdentifier = "S666666"});
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

        var mockService = DatasetMock.GetMockedServiceProvider(groupContextFunc);
        
        var groupsRepository = new GroupsRepository(groupContext, mockService.ServiceScopeFactory.Object);
        var groupsController = new GroupsController();
        groupsController.ControllerContext = DatasetMock.ControllerContext("S777777");
        var updateGroupCmd = new UpdateGroupCmd(groupsRepository, new Queue());
        var result = await groupsController.Update(updateGroupCmd, updateGroupInput);

        var resultOk = result.Result as NoContentResult;
        Assert.NotNull(resultOk);
    }
}
