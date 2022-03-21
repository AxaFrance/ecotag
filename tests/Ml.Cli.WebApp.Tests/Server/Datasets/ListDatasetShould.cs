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
    
     [Theory]
     [InlineData("s666666", false, 1)]
     [InlineData("s666666", null, 2)]
     [InlineData("s666666", true, 1)]
     [InlineData("s666667", true, 0)]
     [InlineData("s666668", true, 0)]
     public async Task ListDataset(string nameIdentifier, bool? locked, int numberResult)
     {
         var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier);
         
         var listDatasetCmd = new ListDatasetCmd(datasetsRepository, usersRepository);
         datasetsController.ControllerContext = new ControllerContext
         {
             HttpContext = context
         };
         var datasets = await datasetsController.GetAllDatasets(listDatasetCmd, locked);
         
         Assert.Equal(numberResult, datasets.Count);
     }
    
}