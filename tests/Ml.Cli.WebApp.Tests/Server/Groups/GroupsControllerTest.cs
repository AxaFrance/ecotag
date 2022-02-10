using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups;
using Ml.Cli.WebApp.Server.Groups.Database;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Groups;

public class CreateGroupShould
{
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
        var newGroup = new Group
        {
            Name = groupName
        };
        var groupContext = new GroupContext(new DbContextOptions<GroupContext>());
        var repository = new GroupsRepository(groupContext);
        var result = await repository.CreateGroupAsync(groupName);
        //var groupsController = new GroupsController().Create(newGroup);
    }
}