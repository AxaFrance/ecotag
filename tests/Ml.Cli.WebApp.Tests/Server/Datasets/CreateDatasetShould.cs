using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets;

public class CreateDatasetShould
{
    [Theory]
    [InlineData("Public", "datasetgood", "Image", null, "s666666")]
    [InlineData("Public", "datasetgood", "Image", "groupName/datasetName", "s666666")]
    public async Task CreateDataset(string classification, string name, string type, string importedDatasetName, string nameIdentifier)
    {
        var fileService = new Mock<IFileService>();
        var filesDict = new Dictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>
        {
            {
                "firstFile.txt",
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                    { Error = new ErrorResult { Key = FileService.InvalidFileExtension } }
            },
            {
                "secondFile.txt",
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                {
                    Data = new FileInfoServiceDataModel
                        { Name = "secondFile.txt", Length = 10, ContentType = "image" }
                }
            },
            { "thirdFile.txt", new ResultWithError<FileInfoServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = FileService.InvalidFileExtension}} }
        };
        fileService
            .Setup(foo =>
                foo.GetInputDatasetFilesAsync("TransferFileStorage", "input", "groupName/datasetName", It.IsAny<string>()))
            .ReturnsAsync(filesDict);
        var result = await InitMockAndExecuteAsync(classification, name, type, importedDatasetName, nameIdentifier, null, fileService.Object);

        var resultOk = result.Result as CreatedResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as Dictionary<string, string>;
        Assert.NotNull(resultValue);
        if (importedDatasetName != null)
        {
            fileService.Verify(foo => foo.GetInputDatasetFilesAsync("TransferFileStorage", "input", "groupName/datasetName", It.IsAny<string>()), Times.Once);
            Assert.Equal(3, resultValue.Count);
            Assert.Equal(FileService.InvalidFileExtension, resultValue["firstFile.txt"]);
            Assert.Null(resultValue["secondFile.txt"]);
            Assert.Equal(FileService.InvalidFileExtension, resultValue["thirdFile.txt"]);
        }
    }

    [Theory]
    [InlineData("Public", "dataset1", "Image", "S666666", DatasetsRepository.AlreadyTakenName, null)]
    [InlineData("Public", "ds", "Image", "S666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "ds**", "Image", "S666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "datasetgood", "Bad", "S607718", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Bad", "datasetgood", "Text", "S607718", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "more_than_forty_eight_characters_dataset_name_aaaaa", "Text", "s666666", CreateDatasetCmd.InvalidModel, null)]
    [InlineData("Public", "datasetgood", "Image", "S607718", CreateDatasetCmd.UserNotFound, null)]
    [InlineData("Public", "datasetgood", "Image", "S666667", CreateDatasetCmd.UserNotInGroup, null)]
    [InlineData("Public", "datasetgood", "Image", "S666667", CreateDatasetCmd.GroupNotFound,
        "6c5b0cdd-2ade-41c0-ba96-d8b17b8cfe78")]
    public async Task ReturnError_WhenCreateDataset(string classification, string name, string type,
        string nameIdentifier, string errorKey, string groupId)
    {
        var result = await InitMockAndExecuteAsync(classification, name, type, null, nameIdentifier, groupId, null);

        var resultWithError = result.Result as BadRequestObjectResult;
        Assert.NotNull(resultWithError);
        var resultWithErrorValue = resultWithError.Value as ErrorResult;
        Assert.Equal(errorKey, resultWithErrorValue?.Key);
    }

    private static async Task<ActionResult<Dictionary<string, string>>> InitMockAndExecuteAsync(string classification,
        string name,
        string type, string importedDatasetName, string nameIdentifier,
        string groupId, IFileService fileServiceObject)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier, fileServiceObject);
        var datasetsController = mockResult.DatasetsController;

        var createDatasetCmd = new CreateDatasetCmd(mockResult.GroupRepository, mockResult.DatasetsRepository,
            mockResult.UsersRepository);
        var result = await datasetsController.Create(createDatasetCmd, new DatasetInput
        {
            Classification = classification,
            Name = name,
            Type = type,
            ImportedDatasetName = importedDatasetName,
            GroupId = groupId ?? mockResult.Group1.Id.ToString()
        });
        return result;
    }
}