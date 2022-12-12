using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Cmd;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.Annotations;
using AxaGuilDEv.Ecotag.Server.Projects;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
using AxaGuilDEv.Ecotag.Tests.Server.Datasets;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using Xunit.Abstractions;

namespace AxaGuilDEv.Ecotag.Tests.Server.Projects;

public class ReserveShould
{
    private readonly ITestOutputHelper _output;

    public ReserveShould(ITestOutputHelper output)
    {
        _output = output;
    }
    
    [Theory]
    [InlineData("s666666", null)]
    [InlineData("s666666", 0)]
    public async Task ReserveDataset(string nameIdentifier, int? fileIdIndex)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var reserveCmd = new ReserveCmd(mockResult.UsersRepository, mockResult.DatasetsRepository, mockResult.ProjectsRepository, mockResult.AnnotationsRepository);
        var result = await mockResult.ProjectsController.Reserve(reserveCmd, mockResult.Dataset3Project1Id, new ReserveInput{ FileId = fileIdIndex.HasValue ? mockResult.fileIds[fileIdIndex.Value] : null });
       
        var resultOk = result.Result as OkObjectResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as IList<ReserveOutput>;
       
        if (fileIdIndex.HasValue)
        {
            Assert.Equal(mockResult.fileIds[fileIdIndex.Value], resultValue[0].FileId);
            Assert.Equal(11, resultValue.Count);
        }
        else
        {
            Assert.Equal(10, resultValue.Count);
        }
    }

    [Theory]
    [InlineData("s666668", UploadFileCmd.UserNotFound)]
    [InlineData("s666667", UploadFileCmd.UserNotInGroup)]
    public async Task ReturnIsForbidden(string nameIdentifier, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var reserveCmd = new ReserveCmd(mockResult.UsersRepository, mockResult.DatasetsRepository, mockResult.ProjectsRepository, mockResult.AnnotationsRepository);
        var result = await mockResult.ProjectsController.Reserve(reserveCmd, mockResult.Dataset3Project1Id, new ReserveInput());

        var forbidResult = result.Result as ForbidResult;
        Assert.NotNull(forbidResult);
        _output.WriteLine($"type of error is {errorKey}");
    }

    [Theory]
    [InlineData("s666666", "10000000-0000-0000-0000-000000000000", ProjectsRepository.NotFound)]
    public async Task ReturnNotFound(string nameIdentifier, string projectId, string errorKey)
    {
        var mockResult = await DatasetMock.InitMockAsync(nameIdentifier);
        var reserveCmd = new ReserveCmd(mockResult.UsersRepository, mockResult.DatasetsRepository, mockResult.ProjectsRepository, mockResult.AnnotationsRepository);
        var result = await mockResult.ProjectsController.Reserve(reserveCmd, projectId, new ReserveInput());

        var notFoundResult = result.Result as BadRequestObjectResult;
        Assert.NotNull(notFoundResult);
        _output.WriteLine($"type of error is {errorKey}");
    }
}