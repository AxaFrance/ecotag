using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.Annotations;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
using AxaGuilDEv.Ecotag.Tests.Server.Datasets;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Projects;

public class GetAnnotationsStatusShould
{
    [Theory]
    [InlineData("s666666")]
    public async Task ShouldGetInformation(string nameIdentifier)
    {
        var mock = await DatasetMock.InitMockAsync(nameIdentifier);

        var getAnnotationsStatusCmd =
            new GetAnnotationsStatusCmd(mock.ProjectsRepository, mock.UsersRepository, mock.AnnotationsRepository);
        var result = await mock.AnnotationsController.GetAnnotationsStatus(getAnnotationsStatusCmd, mock.Dataset3Project1Id);
        var resultOk = result.Result as OkObjectResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as AnnotationStatus;
        Assert.Equal(41, resultValue.NumberAnnotationsToDo);
    }

    [Theory]
    [InlineData("s111111",
        null, GetProjectCmd.UserNotFound)]
    [InlineData("s666666",
        "10000000-0000-0000-0000-000000000000", ProjectsRepository.NotFound)]
    public async Task Should_Return_Error_On_Get_Project(string nameIdentifier, string projectId,
        string errorType)
    {
        var mock = await DatasetMock.InitMockAsync(nameIdentifier);

        var getAnnotationsStatusCmd =
            new GetAnnotationsStatusCmd(mock.ProjectsRepository, mock.UsersRepository, mock.AnnotationsRepository);
        var result = await mock.AnnotationsController.GetAnnotationsStatus(getAnnotationsStatusCmd, projectId ?? mock.Dataset3Project1Id);
        
        var resultError = result.Result as BadRequestObjectResult;
        Assert.NotNull(resultError);
        var resultErrorValue = resultError.Value as ErrorResult;
        Assert.Equal(errorType, resultErrorValue?.Key);
    }

    [Theory]
    [InlineData("s666667")]
    public async Task Should_Return_Forbidden(string nameIdentifier)
    {
        var mock = await DatasetMock.InitMockAsync(nameIdentifier);

        var getAnnotationsStatusCmd =
            new GetAnnotationsStatusCmd(mock.ProjectsRepository, mock.UsersRepository, mock.AnnotationsRepository);
        var result = await mock.AnnotationsController.GetAnnotationsStatus(getAnnotationsStatusCmd, mock.Dataset3Project1Id);

        var resultError = result.Result as ForbidResult;
        Assert.NotNull(resultError);
    }
}