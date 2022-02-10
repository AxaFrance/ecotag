using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using Ml.Cli.WebApp.Server;
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
    
    [Theory]
    [InlineData("[\"abcd\"]", "abcD", false, CreateGroupCmd.AlreadyTakenName)]
    [InlineData("[]", "ab", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "abc", true, "[]")]
    [InlineData("[]", "daizidosqdhuzqijodzqoazdjskqldz", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "abcdefgh", true, "[]")]
    [InlineData("[]", "abd$", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "abcdefghzoiqsdzqosqodz^", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "P$", false, CreateGroupCmd.InvalidModel)]
    [InlineData("[]", "Abcd-dad", true, "[]")]
    [InlineData("[]", "abdd_O", true, "[]")]
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
}