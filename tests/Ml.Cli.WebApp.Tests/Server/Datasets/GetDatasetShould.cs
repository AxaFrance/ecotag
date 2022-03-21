using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class GetDatasetShould
{
    
     [Theory]
     [InlineData("s666666")]
     public async Task GetDataset(string nameIdentifier)
     {
         var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier);
         
         var getDatasetCmd = new GetDatasetCmd(datasetsRepository, usersRepository);
         datasetsController.ControllerContext = new ControllerContext
         {
             HttpContext = context
         };
         var dataset = await datasetsController.GetDataset(getDatasetCmd, dataset1Id);


         var okResult = dataset.Result as OkObjectResult;
         var getDataset = okResult.Value as GetDataset;
         Assert.NotNull(getDataset);
     }

     [Theory]
     [InlineData("S607718", GetDatasetCmd.UserNotFound)]
     [InlineData("S666667", GetDatasetCmd.UserNotInGroup)]
     public async Task ReturnForbidError_WhenGetDataset(string nameIdentifier, string errorKey)
     {
         var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier);
         
         var getDatasetCmd = new GetDatasetCmd(datasetsRepository, usersRepository);
         datasetsController.ControllerContext = new ControllerContext
         {
             HttpContext = context
         };
         var result = await datasetsController.GetDataset(getDatasetCmd, dataset1Id);
         var resultWithError = result.Result as ForbidResult;
         Assert.NotNull(resultWithError);
     }

     [Theory]
     [InlineData("s666666", GetDatasetCmd.DatasetNotFound)]
     public async Task ReturnNotFOUnd_WhenGetDataset(string nameIdentifier, string errorKey)
     {
         var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier);
         
         var getDatasetCmd = new GetDatasetCmd(datasetsRepository, usersRepository);
         datasetsController.ControllerContext = new ControllerContext
         {
             HttpContext = context
         };
         var result = await datasetsController.GetDataset(getDatasetCmd, "10000000-0000-0000-0000-000000000000");
         var resultWithError = result.Result as NotFoundResult;
         Assert.NotNull(resultWithError);
     }
     
}