using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Moq;
using Xunit;
using Xunit.Abstractions;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class UploadFileShould
{
    
    private readonly ITestOutputHelper _output;

    public UploadFileShould(ITestOutputHelper output)
    {
        this._output = output;
    }
    
    [Theory]
    [InlineData("s666666")]
    public async Task CreateDataset(string nameIdentifier)
    {
        var mockFileService = new Mock<IFileService>();
        mockFileService.Setup(_ => _.UploadStreamAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Stream>()));
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier, mockFileService.Object);

        var getDatasetCmd = new UploadFileCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);
        var fileMock = FromFileMock("test.png");
        var result = await mockResult.DatasetsController.OnPostUploadAsync(getDatasetCmd, mockResult.Dataset1Id,
            new List<IFormFile> { fileMock.Object });

        var resultOk = result as OkObjectResult;
        Assert.NotNull(resultOk);
    }

    [Theory]
    [InlineData("s666668", UploadFileCmd.UserNotFound)]
    [InlineData("s666667", UploadFileCmd.UserNotInGroup)]
    public async Task ReturnIsForbidden(string nameIdentifier, string errorKey)
    {
        var mockFileService = new Mock<IFileService>();
        mockFileService.Setup(_ => _.UploadStreamAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Stream>()));
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier, mockFileService.Object);

        var getDatasetCmd = new UploadFileCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);

        var fileMock = FromFileMock("test.png");
        var result = await mockResult.DatasetsController.OnPostUploadAsync(getDatasetCmd, mockResult.Dataset1Id,
            new List<IFormFile> { fileMock.Object });

        var forbidResult = result as ForbidResult;
        Assert.NotNull(forbidResult);
        _output.WriteLine($"type of error is {errorKey}");
    }

    [Theory]
    [InlineData("s666666", "test.toto", null, 0, UploadFileCmd.InvalidModel)]
    [InlineData("s666666", "t", null, 0, UploadFileCmd.InvalidModel)]
    [InlineData("s666666", "test.txt", null, 1, UploadFileCmd.DatasetLocked)]
    [InlineData("s666666", "test.eml_badextention", null, 2, UploadFileCmd.InvalidModel)]
    [InlineData("s666666", "test.txt_badextention", null, 3, UploadFileCmd.InvalidModel)]
    [InlineData("s666666", "test.jpg", 33 * UploadFileCmd.Mb, 0, UploadFileCmd.FileTooLarge)]
    public async Task ReturnBadRequest(string nameIdentifier, string fileName, long? fileLength, int indexDataset,
        string errorKey)
    {
        var mockFileService = new Mock<IFileService>();
        mockFileService.Setup(_ => _.UploadStreamAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<Stream>()));
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier, mockFileService.Object);

        var getDatasetCmd = new UploadFileCmd(mockResult.UsersRepository, mockResult.DatasetsRepository);

        var fileMock = FromFileMock(fileName, fileLength);
        var datasets = new[] { mockResult.Dataset1Id, mockResult.Dataset2Id, mockResult.DatasetEmlOpen, mockResult.DatasetTxtOpen };
        var result = await mockResult.DatasetsController.OnPostUploadAsync(getDatasetCmd, datasets[indexDataset],
            new List<IFormFile> { fileMock.Object });

        var resultWithError = result as BadRequestObjectResult;
        Assert.NotNull(resultWithError);
        var resultWithErrorValue = resultWithError.Value as ErrorResult;
        Assert.Equal(errorKey, resultWithErrorValue?.Key);
    }

    private static Mock<IFormFile> FromFileMock(string fileName, long? fileLength = null)
    {
        var fileMock = new Mock<IFormFile>();
        var content = new StringBuilder("Hello World from a Fake File");
        if (fileLength != null)
            for (var index = 0; index < fileLength / 10; index++)
                content.Append("123456789a");
        var ms = new MemoryStream();
        var writer = new StreamWriter(ms);
        writer.Write(content.ToString());
        writer.Flush();
        ms.Position = 0;
        fileMock.Setup(_ => _.OpenReadStream()).Returns(ms);
        fileMock.Setup(_ => _.FileName).Returns(fileName);
        fileMock.Setup(_ => _.Length).Returns(ms.Length);
        fileMock.Setup(_ => _.ContentType).Returns("text/html");
        return fileMock;
    }
}