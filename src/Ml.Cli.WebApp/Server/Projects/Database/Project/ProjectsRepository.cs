using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public class ProjectsRepository : IProjectsRepository
{
    private readonly ProjectContext _projectsContext;
    public const string AlreadyTakenName = "AlreadyTakenName";

    public ProjectsRepository(ProjectContext projectsContext)
    {
        _projectsContext = projectsContext;
    }
    
    public async Task<ResultWithError<string, ErrorResult>> CreateProjectAsync(string projectName)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var projectModel = new ProjectModel
        {
            Name = projectName
        };
        var result =  _projectsContext.Projects.AddIfNotExists(projectModel);
        if (result == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = AlreadyTakenName
            };
            return commandResult;
        }

        await _projectsContext.SaveChangesAsync();
        commandResult.Data = projectModel.Id.ToString();
        return commandResult;
    }

    public async Task<List<ProjectDataModel>> GetAllProjectsAsync()
    {
        var projectModelEnum = await _projectsContext.Projects.AsNoTracking().ToListAsync();
        return projectModelEnum.ConvertAll(element => element.ToProjectDataModel());
    }
}