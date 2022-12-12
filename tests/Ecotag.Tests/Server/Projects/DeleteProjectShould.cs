using System;
using System.IO;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server;
using AxaGuilDEv.Ecotag.Server.Datasets;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.FileStorage;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
using AxaGuilDEv.Ecotag.Tests.Server.Datasets;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Projects;

public class DeleteProjectShould
{
    [Theory]
    [InlineData("s666666")]
    public async Task Should_Delete_Project(string nameIdentifier)
    {
        var (mockedFileService, mockedBlobService) = InitServices();
        var mockedResult = await DatasetMock.InitMockAsync(nameIdentifier, mockedFileService);
        var options = Options.Create(new DatasetsSettings() { IsBlobTransferActive = true});
        var deleteProjectCmd = new ExportThenDeleteProjectCmd(mockedResult.UsersRepository, mockedResult.ProjectsRepository, mockedResult.DatasetsRepository, mockedResult.AnnotationsRepository, mockedResult.DeleteRepository, mockedBlobService, mockedResult.GroupRepository, options);
        var result = await mockedResult.ProjectsController.Delete(deleteProjectCmd, mockedResult.Dataset3Project1Id);
        var resultOk = result as OkResult;
        Assert.NotNull(resultOk);
    }

    [Theory]
    [InlineData("s111111", true, ExportThenDeleteProjectCmd.UserNotFound)]
    [InlineData("s666666", false, ProjectsRepository.NotFound)]
    public async Task Should_Return_Error_On_Project_Deletion(string nameIdentifier, bool isProjectKnown, string errorKey)
    {
        var (mockedFileService, mockedBlobService) = InitServices();
        var mockedResult = await DatasetMock.InitMockAsync(nameIdentifier, mockedFileService);
        var options = Options.Create(new DatasetsSettings() { IsBlobTransferActive = true});
        var deleteProjectCmd = new ExportThenDeleteProjectCmd(mockedResult.UsersRepository, mockedResult.ProjectsRepository, mockedResult.DatasetsRepository, mockedResult.AnnotationsRepository, mockedResult.DeleteRepository, mockedBlobService, mockedResult.GroupRepository, options);
        var result = await mockedResult.ProjectsController.Delete(deleteProjectCmd, isProjectKnown ? mockedResult.Dataset3Project1Id : new Guid().ToString());
        var resultKo = result as BadRequestObjectResult;
        Assert.NotNull(resultKo);
        var resultKoValue = resultKo.Value as ErrorResult;
        Assert.NotNull(resultKoValue);
        Assert.Equal(errorKey, resultKoValue.Key);
    }

    private static (IFileService, IFileService) InitServices()
    {
        var mockedFileService = new Mock<IFileService>();
        mockedFileService
            .Setup(foo => foo.DeleteAsync(It.IsAny<string>()))
            .ReturnsAsync(true);
        var mockedBlobService = new Mock<IFileService>();
        mockedBlobService
            .Setup(foo => foo.UploadStreamAsync(It.IsAny<string>(), It.IsAny<Stream>()));
        return (mockedFileService.Object, mockedBlobService.Object);
    }
}