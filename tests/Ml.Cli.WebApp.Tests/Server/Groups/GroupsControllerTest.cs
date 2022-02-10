using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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
    [InlineData("[\"abcd\"]", "abcD", false)]
    [InlineData("[]", "ab", false)]
    [InlineData("[]", "abc", true)]
    [InlineData("[]", "daizidosqdhuzqijodzqoazdjskqldz", false)]
    [InlineData("[]", "abcdefgh", true)]
    [InlineData("[]", "abd$", false)]
    [InlineData("[]", "abcdefghzoiqsdzqosqodz^", false)]
    [InlineData("[]", "P$", false)]
    [InlineData("[]", "Abcd-dad", true)]
    [InlineData("[]", "abdd_O", true)]
    [InlineData("[]", "zqdsqd(", false)]
    public async Task Create_NewGroup(string groupNamesInDatabase, string groupName, bool isSuccess)
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
        var createGroupCmd = new CreateGroupCmd(repository);
        var result = await createGroupCmd.ExecuteAsync(newGroup);
        Assert.Equal(isSuccess, result.IsSuccess);
        //var result = await repository.CreateGroupAsync(groupName);
        //exemple guid: 44e7ac60-c756-47e8-4d72-08d9ec7e2bc4
    }
}