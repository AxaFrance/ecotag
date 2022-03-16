using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class ProjectsControllerTest
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
        private readonly ProjectsController _projectsController;
        public CreateProjectTest()
        {
            _projectsController = new ProjectsController();
            var nameIdentifier = "someone@gmail.com";
            var context = new DefaultHttpContext()
            {
                User = new ClaimsPrincipal(new ClaimsIdentity(new[]
                {
                    new Claim(IdentityExtensions.EcotagClaimTypes.NameIdentifier, nameIdentifier)
                }))
            };
            _projectsController.ControllerContext = new ControllerContext
            {
                HttpContext = context
            };
        }
        private static async Task<ProjectContext> GetProjectContext(List<string> projectNamesArray)
        {
            var projectContext = GetInMemoryProjectContext();
            if (projectNamesArray != null)
            {
                projectNamesArray.ForEach(project =>
                    projectContext.Projects.Add(new ProjectModel { Name = project})
                );
                await projectContext.SaveChangesAsync();
            }
            
            
            return projectContext;
        }
        
        [Theory]
        [InlineData(
            "[]",
            "{\"Name\": \"someProjectName\", \"DatasetId\": \"10000000-0000-0000-0000-000000000000\", \"GroupId\":\"10000000-0000-0000-0000-000000000000\", \"NumberCrossAnnotation\": 1, \"AnnotationType\": \"NER\", \"Labels\": [{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]}")]
        public async Task Should_Create_New_Project(string projectNamesInDatabase, string newProject)
        {
            var projectNamesArray = JsonConvert.DeserializeObject<List<string>>(projectNamesInDatabase);
            var newProjectInput = JsonConvert.DeserializeObject<CreateProjectInput>(newProject);

            var projectContext = await GetProjectContext(projectNamesArray);
            var repository = new ProjectsRepository(projectContext);
            var createProjectCmd = new CreateProjectCmd(repository);
            var result = await _projectsController.Create(createProjectCmd, newProjectInput);
            var resultCreated = result.Result as CreatedResult;
            Assert.NotNull(resultCreated);
        }

        [Theory]
        [InlineData(
            "[\"projectName\"]",
            "{\"Name\": \"projectName\", \"DatasetId\": \"10000000-0000-0000-0000-000000000000\", \"GroupId\":\"10000000-0000-0000-0000-000000000000\", \"NumberCrossAnnotation\": 1, \"AnnotationType\": \"NER\", \"Labels\": [{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]}",
            ProjectsRepository.AlreadyTakenName)]
        [InlineData(
            "[]",
            "{\"Name\": \"a\", \"DatasetId\": \"10000000-0000-0000-0000-000000000000\", \"GroupId\":\"10000000-0000-0000-0000-000000000000\", \"NumberCrossAnnotation\": 1, \"AnnotationType\": \"NER\", \"Labels\": [{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]}",
            CreateProjectCmd.InvalidModel)]
        [InlineData(
            "[]",
            "{\"Name\": \"dzuqidjzuidhuizjdoqdiuozqdsd\", \"DatasetId\": \"10000000-0000-0000-0000-000000000000\", \"GroupId\":\"10000000-0000-0000-0000-000000000000\", \"NumberCrossAnnotation\": 1, \"AnnotationType\": \"NER\", \"Labels\": [{\"Id\":\"10000000-0000-0000-0000-000000000000\",\"Name\":\"LabelName\",\"Color\":\"#000000\"}]}",
            CreateProjectCmd.InvalidModel)]
        public async Task Should_Return_Error_On_Project_Creation(string projectNamesInDatabase, string newProject, string errorType)
        {
            var projectNamesArray = JsonConvert.DeserializeObject<List<string>>(projectNamesInDatabase);
            var newProjectInput = JsonConvert.DeserializeObject<CreateProjectInput>(newProject);

            var projectContext = await GetProjectContext(projectNamesArray);
            var repository = new ProjectsRepository(projectContext);
            var createProjectCmd = new CreateProjectCmd(repository);
            var result = await _projectsController.Create(createProjectCmd, newProjectInput);
            var resultWithError = result.Result as BadRequestObjectResult;
            Assert.NotNull(resultWithError);
            var resultWithErrorValue = resultWithError.Value as ErrorResult;
            Assert.Equal(errorType, resultWithErrorValue?.Key);
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