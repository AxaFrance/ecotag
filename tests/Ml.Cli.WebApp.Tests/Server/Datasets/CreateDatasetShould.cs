﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Datasets.BlobStorage;
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
        var transferService = new Mock<ITransferService>();
        transferService
            .Setup(foo => foo.DownloadDatasetFilesAsync("input", "groupName/datasetName", It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(new Dictionary<string, ResultWithError<FileServiceDataModel, ErrorResult>>());
        var result = await InitMockAndExecuteAsync(classification, name, type, importedDatasetName, nameIdentifier, null, transferService.Object);

        var resultOk = result.Result as CreatedResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as Dictionary<string, string>;
        Assert.NotNull(resultValue);
        if (importedDatasetName != null)
        {
            transferService.Verify(foo => foo.DownloadDatasetFilesAsync("input", "groupName/datasetName", It.IsAny<string>(), It.IsAny<string>()), Times.Once);
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

    private static async Task<ActionResult<Dictionary<string, string>>> InitMockAndExecuteAsync(string classification, string name,
        string type, string importedDatasetName, string nameIdentifier,
        string groupId, ITransferService transferServiceObject)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier, null, transferServiceObject);
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