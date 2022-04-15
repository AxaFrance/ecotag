using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Groups;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Groups;

public class UsersControllerShould
{

    [Theory]
    [InlineData("[\"Guillaume.chervet@gmail.com\",\"Lilian.delouvy@gmail.com\"]")]
    [InlineData("[]")]
    public async Task Get_AllUsers(string userEmailsInDatabase)
    {
        var usersList = JsonConvert.DeserializeObject<List<string>>(userEmailsInDatabase);
        Assert.NotNull(usersList);

        var groupContext = GroupsControllerShould.GetInMemoryGroupContext()();

        foreach (var userEmail in usersList)
        {
            groupContext.Users.Add(new UserModel { Id = new Guid(), Email = userEmail, NameIdentifier = "S666666" });
        }

        await groupContext.SaveChangesAsync();
        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var usersRepository = new UsersRepository(groupContext, memoryCache);
        var usersController = new UsersController();
        var getAllUsersCmd = new GetAllUsersCmd(usersRepository);

        var result = await usersController.GetAllUsers(getAllUsersCmd);
        var okObjectResult = result.Result as OkObjectResult;
        Assert.NotNull(okObjectResult);
        var resultList = okObjectResult.Value as List<UserDataModel>;
        Assert.NotNull(resultList);
        Assert.Equal(resultList.Count, usersList.Count);
        foreach (var userEmail in usersList)
        {
            Assert.Contains(resultList, resultElement => resultElement.Email.Equals(userEmail));
        }
    }
}