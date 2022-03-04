using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    
    [Theory]
    [InlineData("[]", "someProjectName")]
    public async Task Should_Create_New_Project(string projectNamesInDatabase, string newProjectName)
    {
        var projectNamesArray = JsonConvert.DeserializeObject<List<string>>(projectNamesInDatabase);
        var newProject = new CreateProjectInput { Name = newProjectName };

        var projectContext = GetInMemoryProjectContext();
        if (projectNamesArray != null)
        {
            projectNamesArray.ForEach(project =>
                projectContext.Projects.Add(new ProjectModel { Name = project})
            );
            await projectContext.SaveChangesAsync();
        }
        var repository = new ProjectsRepository(projectContext);
        var projectsController = new ProjectsController();
        var createProjectCmd = new CreateProjectCmd(repository);
        var result = await projectsController.Create(createProjectCmd, newProject);
        var resultCreated = result.Result as CreatedResult;
        Assert.NotNull(resultCreated);
    }
}