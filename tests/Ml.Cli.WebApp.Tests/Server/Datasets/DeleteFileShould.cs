using System;
using System.IO;
using System.Security.Claims;
using System.Text;
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
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class DeleteFileShould
{

 /*   [Theory]
    [InlineData("s666666")]
    public async Task DeleteFile(string nameIdentifier)
    {
        var mockFileService = new Mock<IFileService>();
        var content = "Hello World from a Fake File";
        var fileServiceResult = new ResultWithError<FileDataModel, ErrorResult>();
        var ms = new MemoryStream();
        var writer = new StreamWriter(ms);
        writer.Write(content.ToString());
        writer.Flush();
        ms.Position = 0;
        fileServiceResult.Data = new FileDataModel()
        {
            Name = "test.png",
            Length = ms.Length,
            ContentType = "image/png",
            Stream = ms
        };
        mockFileService.Setup(_ => _.DownloadAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(fileServiceResult);
        var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier, mockFileService.Object);
        var deleteFileCmd = new DeleteFileCmd(usersRepository, datasetsRepository);
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var result = await datasetsController.DeleteFile(deleteFileCmd, dataset1Id, fileId1);

        var fileStreamResult = result as FileStreamResult;
        Assert.NotNull(fileStreamResult);
    }
    
    [Theory]
    [InlineData("s666668", UploadFileCmd.UserNotFound)]
    [InlineData("s666667", UploadFileCmd.UserNotInGroup)]
    public async Task ReturnIsForbidden(string nameIdentifier, string errorKey)
    {
        var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier);
        
        var getFileCmd = new GetFileCmd(usersRepository, datasetsRepository);
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var result = await datasetsController.GetDatasetFile(getFileCmd, dataset1Id, fileId1);

        var forbidResult = result as ForbidResult;
        Assert.NotNull(forbidResult);
    }
    
    [Theory]
    [InlineData("s666666", "10000000-0000-0000-0000-000000000000", null, GetFileCmd.DatasetNotFound)]
    [InlineData("s666666", null, "10000000-0000-0000-0000-000000000000", DatasetsRepository.FileNotFound)]
    public async Task ReturnNotFound(string nameIdentifier, string datasetId, string fileId, string errorKey)
    {
        var (group1, usersRepository, groupRepository, datasetsRepository, datasetsController, context, dataset1Id, dataset2Id, fileId1) = await CreateDatasetShould.InitMockAsync(nameIdentifier);
        
        var getFileCmd = new GetFileCmd(usersRepository, datasetsRepository);
        datasetsController.ControllerContext = new ControllerContext
        {
            HttpContext = context
        };
        var result = await datasetsController.GetDatasetFile(getFileCmd, datasetId??dataset1Id, fileId??fileId1);

        var notFoundResult = result as NotFoundResult;
        Assert.NotNull(notFoundResult);
    }
*/
}