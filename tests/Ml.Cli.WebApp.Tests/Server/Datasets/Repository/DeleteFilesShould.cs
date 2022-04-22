using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Datasets.Repository;

public class DeleteFilesShould
{
    [Theory]
    [InlineData(true, true, "s666666")]
    public async Task Should_Delete_Files(bool isDatasetKnown, bool isFileKnown, string nameIdentifier)
    {
        var mockedResult = await InitMockAsync(nameIdentifier);
        var datasetId = isDatasetKnown ? mockedResult.Dataset1Id : new Guid().ToString();
        var fileId = isFileKnown ? mockedResult.FileId1 : new Guid().ToString();
        var result = await mockedResult.DatasetsRepository.DeleteFilesAsync(datasetId, new List<string> { fileId });
        var resultData = result.Data;
        Assert.True(resultData);
    }

    [Theory]
    [InlineData(false, true, "s666666", DatasetsRepository.FileNotFound)]
    [InlineData(true, false, "s666666", DatasetsRepository.FileNotFound)]
    public async Task Should_Return_Error_When_Deleting_Files(bool isDatasetKnown, bool isFileKnown,
        string nameIdentifier, string errorKey)
    {
        var mockedResult = await InitMockAsync(nameIdentifier);
        var datasetId = isDatasetKnown ? mockedResult.Dataset1Id : new Guid().ToString();
        var fileId = isFileKnown ? mockedResult.FileId1 : new Guid().ToString();
        var result = await mockedResult.DatasetsRepository.DeleteFilesAsync(datasetId, new List<string> { fileId });
        var resultError = result.Error;
        Assert.NotNull(resultError);
        Assert.Equal(errorKey, resultError.Key);
    }

    private async Task<MockResult> InitMockAsync(string nameIdentifier)
    {
        var mockedFileService = new Mock<IFileService>();
        mockedFileService
            .Setup(foo => foo.DeleteAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync(true);
        var mockedResult = await DatasetMock.InitMockAsync(nameIdentifier, mockedFileService.Object);
        return mockedResult;
    }
}