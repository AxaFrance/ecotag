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
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class ListDatasetShould
{
    
    /* [Theory]
     [InlineData("[\"Guillaume.chervet@gmail.com\",\"Lilian.delouvy@gmail.com\"]")]
     [InlineData("[]")]
     public async Task List_Datastes(string userEmailsInDatabase)
     {
         var usersList = JsonConvert.DeserializeObject<List<string>>(userEmailsInDatabase);
 
         var groupContext = GroupsControllerTest.GetInMemoryGroupContext();
         foreach (var userEmail in usersList)
         {
             groupContext.Users.Add(new UserModel { Id = new Guid(), Email = userEmail, Subject = "S666666" });
         }
         await groupContext.SaveChangesAsync();
         var datasetContext = GetInMemoryDatasetContext();
         
         var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
         var usersRepository = new UsersRepository(groupContext, memoryCache);
         var datasetsRepository = new DatasetsRepository(datasetContext);
         var datasetsController = new DatasetsController();
 
         var context = new DefaultHttpContext()
         {
             User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                 {
                     new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, "S607718"),
                 }
             ))
         };
     
         datasetsController.ControllerContext = new ControllerContext
         {
             HttpContext = context
         };
         
         var listDatasetCmd = new ListDatasetCmd(datasetsRepository, usersRepository);
         var datasets = await datasetsController.GetAllDatasets(listDatasetCmd, true);
     }*/
    
}