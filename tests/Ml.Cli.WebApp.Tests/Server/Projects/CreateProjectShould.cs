using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Ml.Cli.WebApp.Tests.Server.Groups;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class CreateProjectShould
{
    public static ProjectContext GetInMemoryProjectContext()
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
    
    [Theory]
    [InlineData("projectName", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", "10000000-0000-0000-0000-000000000000")]
    public async Task CreateProject(string name, int numberCrossAnnotation, string annotationType, string labelsJson,
        string nameIdentifier, string groupId)
    {
        var labels = JsonSerializer.Deserialize<List<CreateProjectLabelInput>>(labelsJson, new JsonSerializerOptions{PropertyNameCaseInsensitive = true});
        var result =
            await InitMockAndExecuteAsync(name, numberCrossAnnotation, annotationType, labels, nameIdentifier, groupId);

        var resultOk = result.Result as CreatedResult;
        Assert.NotNull(resultOk);
        var resultValue = resultOk.Value as string;
        Assert.NotNull(resultValue);
    }

    [Theory]
    [InlineData("a", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.InvalidModel, null)]
    [InlineData("too_long_project_name", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.InvalidModel, null)]
    [InlineData("projectName", 1, "wrongAnnotationType", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.InvalidModel, null)]        [InlineData("project1", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000001\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000002\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000003\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000004\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000005\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000006\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000007\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000008\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000009\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000010\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000011\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000012\",\"Name\":\"LabelName\",\"Color\":\"#000000\"},{\"Id\":\"10000000-0000-0000-0000-000000000013\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.InvalidModel, null)]
    [InlineData("projectName", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", CreateProjectCmd.GroupNotFound, "6c5b0cdd-2ade-41c0-ba96-d8b17b8cfe78")]
    [InlineData("projectName", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s777777", CreateProjectCmd.UserNotFound, null)]
    [InlineData("projectName", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666667", CreateProjectCmd.UserNotInGroup, null)]
    [InlineData("project1", 1, "NamedEntity", "[{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]", "s666666", ProjectsRepository.AlreadyTakenName, null)]
    public async Task ReturnError_WhenCreateProject(string name, int numberCrossAnnotation, string annotationType, string labelsJson,
        string nameIdentifier, string errorKey, string groupId)
    {
        var labels = JsonSerializer.Deserialize<List<CreateProjectLabelInput>>(labelsJson, new JsonSerializerOptions{PropertyNameCaseInsensitive = true});
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
                Id = new Guid("11111111-0000-0000-0000-000000000000"),
                Name = "project1",
                AnnotationType = AnnotationTypeEnumeration.ImageClassifier,
                CreateDate = DateTime.Now.Ticks,
                CreatorNameIdentifier = "s666666",
                NumberCrossAnnotation = 1,
                LabelsJson = "[{\"Name\":\"cat\", \"Color\": \"#008194\", \"Id\": \"#008194\"}]",
                DatasetId = new Guid("10000000-1111-0000-0000-000000000000"),
                GroupId = group.Id
            });
            projectContext.Projects.Add(new ProjectModel
            {
                Name = "project2",
                AnnotationType = AnnotationTypeEnumeration.ImageClassifier,
                CreateDate = DateTime.Now.Ticks,
                CreatorNameIdentifier = "s666666",
                NumberCrossAnnotation = 1,
                LabelsJson = "[{\"Name\":\"cat\", \"Color\": \"#008194\", \"Id\": \"#008194\"}]",
                DatasetId = new Guid(),
                GroupId = group.Id
            });
            await projectContext.SaveChangesAsync();
            
            var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
            var projectsRepository = new ProjectsRepository(projectContext, memoryCache);
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