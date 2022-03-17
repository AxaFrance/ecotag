using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Newtonsoft.Json;
using Xunit;
using Options = Microsoft.Extensions.Options.Options;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class ProjectsControllerShould
{
    private static ProjectContext GetInMemoryProjectContext()
    {
        var builder = new DbContextOptionsBuilder<ProjectContext>();
        var databaseName = Guid.NewGuid().ToString();
        builder.UseInMemoryDatabase(databaseName);

        var options = builder.Options;
        var projectContext = new ProjectContext(options);
        projectContext.Database.EnsureCreated();
        projectContext.Database.EnsureCreatedAsync();
        return projectContext;
    }

    public class CreateProjectTest
    {
        [Theory]
        [InlineData("projectName", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", "10000000-0000-0000-0000-000000000000")]
        public async Task CreateProject(string name, int numberCrossAnnotation, string annotationType, string labelsJson,
            string nameIdentifier, string groupId)
        {
            var labels = JsonConvert.DeserializeObject<List<CreateProjectLabelInput>>(labelsJson);
            var result =
                await InitMockAndExecuteAsync(name, numberCrossAnnotation, annotationType, labels, nameIdentifier, groupId);

            var resultOk = result.Result as CreatedResult;
            Assert.NotNull(resultOk);
            var resultValue = resultOk.Value as string;
            Assert.NotNull(resultValue);
        }

        [Theory]
        [InlineData("a", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.InvalidModel, null)]
        [InlineData("too_long_project_name", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.InvalidModel, null)]
        [InlineData("projectName", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.GroupNotFound, "6c5b0cdd-2ade-41c0-ba96-d8b17b8cfe78")]
        [InlineData("projectName", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s777777", CreateProjectCmd.UserNotFound, null)]
        [InlineData("projectName", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666667", CreateProjectCmd.UserNotInGroup, null)]
        [InlineData("project1", 1, "NER", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", ProjectsRepository.AlreadyTakenName, null)]
        public async Task ReturnError_WhenCreateProject(string name, int numberCrossAnnotation, string annotationType, string labelsJson,
            string nameIdentifier, string errorKey, string groupId)
        {
            var labels = JsonConvert.DeserializeObject<List<CreateProjectLabelInput>>(labelsJson);
            var result =
                await InitMockAndExecuteAsync(name, numberCrossAnnotation, annotationType, labels, nameIdentifier, groupId);

            var resultWithError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultWithError);
            var resultWithErrorValue = resultWithError.Value as ErrorResult;
            Assert.Equal(errorKey, resultWithErrorValue?.Key);
        }

        private static async Task<ActionResult<string>> InitMockAndExecuteAsync(string name, int numberCrossAnnotation,
            string annotationType, List<CreateProjectLabelInput> labels, string nameIdentifier, string groupId)
        {
            var (group, usersRepository, groupsRepository, projectsRepository, projectsController, context) =
                await InitMockAsync(nameIdentifier);
            projectsController.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
            var createProjectCmd = new CreateProjectCmd(projectsRepository, groupsRepository, usersRepository);
            var result = await projectsController.Create(createProjectCmd, new CreateProjectInput()
            {
                Name = name,
                NumberCrossAnnotation = numberCrossAnnotation,
                AnnotationType = annotationType,
                GroupId = groupId ?? group.Id.ToString(),
                DatasetId = new Guid().ToString(),
                Labels = labels
            });
            return result;
        }

        public static async
            Task<(GroupModel group, UsersRepository usersRepository, GroupsRepository groupsRepository,
                ProjectsRepository projectsRepository, ProjectsController projectsController, DefaultHttpContext context
                )> InitMockAsync(string nameIdentifier)
        {
            var groupContext = GroupsControllerShould.GetInMemoryGroupContext();

            var group = new GroupModel() { Name = "group", Id = new Guid("10000000-0000-0000-0000-000000000000") };
            groupContext.Groups.Add(group);
            await groupContext.SaveChangesAsync();

            var user1 = new UserModel() { Email = "test@gmail.com", Subject = "s666666"};
            var user2 = new UserModel() { Email = "test2@gmail.com", Subject = "s666667" };
            groupContext.Users.Add(user1);
            groupContext.Users.Add(user2);
            await groupContext.SaveChangesAsync();

            groupContext.GroupUsers.Add(new GroupUsersModel { UserId = user1.Id, GroupId = group.Id });
            await groupContext.SaveChangesAsync();

            var projectContext = GetInMemoryProjectContext();
            projectContext.Projects.Add(new ProjectModel
            {
                Name = "project1",
                AnnotationType = "NER",
                CreateDate = DateTime.Now.Ticks,
                CreatorNameIdentifier = "s666666",
                NumberCrossAnnotation = 1,
                LabelsJson = "",
                DatasetId = new Guid(),
                GroupId = group.Id
            });
            projectContext.Projects.Add(new ProjectModel
            {
                Name = "project2",
                AnnotationType = "NER",
                CreateDate = DateTime.Now.Ticks,
                CreatorNameIdentifier = "s666666",
                NumberCrossAnnotation = 1,
                LabelsJson = "",
                DatasetId = new Guid(),
                GroupId = group.Id
            });
            await projectContext.SaveChangesAsync();
            
            var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
            var projectsRepository = new ProjectsRepository(projectContext);
            var groupsRepository = new GroupsRepository(groupContext, null);
            var usersRepository = new UsersRepository(groupContext, memoryCache);
            var projectsController = new ProjectsController();
            
            var context = new DefaultHttpContext()
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }))
            };
            return (group, usersRepository, groupsRepository, projectsRepository, projectsController, context);
        }
    }

    public class GetProjectTest
    {
        private static async Task<ProjectContext> GetProjectContext(List<ProjectDataModel> projectsNamesArray)
        {
            var projectContext = GetInMemoryProjectContext();
            foreach (var projectDataModel in projectsNamesArray)
            {
                projectContext.Projects.Add(new ProjectModel { Id = new Guid(projectDataModel.Id), Name = projectDataModel.Name });
            }

            await projectContext.SaveChangesAsync();
            return projectContext;
        }

        [Theory]
        [InlineData("[{\"Id\":\"10000000-0000-0000-0000-000000000000\", \"Name\": \"projectName\"}]",
            "10000000-0000-0000-0000-000000000000", "projectName")]
        public async Task Should_Get_Project(string strProjectsInDatabase, string searchedId, string expectedProjectName)
        {
            var projectsInDatabase = JsonConvert.DeserializeObject<List<ProjectDataModel>>(strProjectsInDatabase);
            var projectContext = await GetProjectContext(projectsInDatabase);
            var projectsRepository = new ProjectsRepository(projectContext);
            var projectsController = new ProjectsController();
            var getProjectCmd = new GetProjectCmd(projectsRepository);

            var result = await projectsController.GetProject(getProjectCmd, searchedId);
            var resultOk = result.Result as OkObjectResult;
            Assert.NotNull(resultOk);
            var resultValue = resultOk.Value as ProjectDataModel;
            Assert.Equal(expectedProjectName, resultValue?.Name);
        }

        [Theory]
        [InlineData("[{\"Id\":\"10000000-0000-0000-0000-000000000000\", \"Name\": \"projectName\"}]",
            "11111111-0000-0000-0000-000000000000", GetProjectCmd.ProjectNotFound)]
        public async Task Should_Return_Error_On_Get_Project(string strProjectsInDatabase, string searchedId,
            string errorType)
        {
            var projectsInDatabase = JsonConvert.DeserializeObject<List<ProjectDataModel>>(strProjectsInDatabase);
            var projectContext = await GetProjectContext(projectsInDatabase);
            var projectsRepository = new ProjectsRepository(projectContext);
            var projectsController = new ProjectsController();
            var getProjectCmd = new GetProjectCmd(projectsRepository);

            var result = await projectsController.GetProject(getProjectCmd, searchedId);
            var resultOk = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultOk);
            var resultValue = resultOk.Value as ErrorResult;
            Assert.Equal(errorType, resultValue?.Key);
        }
    }

    [Theory]
    [InlineData("[\"firstProjectName\",\"secondProjectName\"]")]
    [InlineData("[]")]
    public async Task Should_Get_All_projects(string projectsNamesInDatabase)
    {
        var projectsList = JsonConvert.DeserializeObject<List<string>>(projectsNamesInDatabase);

        var projectContext = GetInMemoryProjectContext();

        foreach (var projectName in projectsList)
        {
            projectContext.Projects.Add(new ProjectModel { Name = projectName });
        }

        await projectContext.SaveChangesAsync();

        var projectsRepository = new ProjectsRepository(projectContext);
        var projectsController = new ProjectsController();
        var getAllProjectsCmd = new GetAllProjectsCmd(projectsRepository);

        var result = await projectsController.GetAllProjects(getAllProjectsCmd);
        var okObjectResult = result.Result as OkObjectResult;
        Assert.NotNull(okObjectResult);
        var resultList = okObjectResult.Value as List<ProjectDataModel>;
        Assert.NotNull(resultList);
        Assert.Equal(resultList.Count, projectsList.Count);
        foreach (var projectName in projectsList)
        {
            Assert.Contains(resultList, element => element.Name.Equals(projectName));
        }
    }
}