using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class GetFileShould
{
    private readonly ITestOutputHelper _output;

    public GetFileShould(ITestOutputHelper output)
    {
        this._output = output;
    }
    
    [Theory]
    [InlineData("s666666")]
    public async Task GetFile(string nameIdentifier)
    {
        var content = "Hello World from a Fake File";
        var fileServiceResult = new ResultWithError<FileServiceDataModel, ErrorResult>();
        var ms = new MemoryStream();
        var writer = new StreamWriter(ms);
        writer.Write(content);
        writer.Flush();
        ms.Position = 0;
        fileServiceResult.Data = new FileServiceDataModel
        {
            Name = "test.png",
            Length = ms.Length,
            ContentType = "image/png",
            Stream = ms
        };
        var mockFileService = new Mock<IFileService>();
        mockFileService.Setup(_ => _.DownloadAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(fileServiceResult);
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier, mockFileService.Object);
        var lockDatasetCmd = new GetFileCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);

        var result =
            await mockResult.DatasetsController.GetDatasetFile(lockDatasetCmd, mockResult.Dataset1Id,
                mockResult.FileId1);

        var fileStreamResult = result as FileStreamResult;
        Assert.NotNull(fileStreamResult);
    }

    [Theory]
    [InlineData("s666668", UploadFileCmd.UserNotFound)]
    [InlineData("s666667", UploadFileCmd.UserNotInGroup)]
    public async Task ReturnIsForbidden(string nameIdentifier, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var getFileCmd = new GetFileCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);
        var result =
            await mockResult.DatasetsController.GetDatasetFile(getFileCmd, mockResult.Dataset1Id, mockResult.FileId1);

        var forbidResult = result as ForbidResult;
        Assert.NotNull(forbidResult);
        _output.WriteLine($"type of error is {errorKey}");
    }

    [Theory]
    [InlineData("s666666", "10000000-0000-0000-0000-000000000000", null, GetFileCmd.DatasetNotFound)]
    [InlineData("s666666", null, "10000000-0000-0000-0000-000000000000", DatasetsRepository.FileNotFound)]
    public async Task ReturnNotFound(string nameIdentifier, string datasetId, string fileId, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);

        var getFileCmd = new GetFileCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);

        var result = await mockResult.DatasetsController.GetDatasetFile(getFileCmd, datasetId ?? mockResult.Dataset1Id,
            fileId ?? mockResult.FileId1);

        var notFoundResult = result as NotFoundResult;
        Assert.NotNull(notFoundResult);
        _output.WriteLine($"type of error is {errorKey}");
    }
}