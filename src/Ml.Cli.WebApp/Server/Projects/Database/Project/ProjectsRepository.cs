using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public class ProjectsRepository : IProjectsRepository
{
    private readonly ProjectContext _projectsContext;
    public const string AlreadyTakenName = "AlreadyTakenName";

    public ProjectsRepository(ProjectContext projectsContext)
    {
        _projectsContext = projectsContext;
    }
    
    public async Task<ResultWithError<string, ErrorResult>> CreateProjectAsync(CreateProjectWithUserInput projectWithUserInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var projectInput = projectWithUserInput.CreateProjectInput;
        var projectModel = new ProjectModel
        {
            Name = projectInput.Name,
            AnnotationType = projectInput.AnnotationType.ToAnnotationType(),
            DatasetId = new Guid(projectInput.DatasetId),
            GroupId = new Guid(projectInput.GroupId),
            LabelsJson = JsonConvert.SerializeObject(projectInput.Labels),
            NumberCrossAnnotation = projectInput.NumberCrossAnnotation,
            CreateDate = new DateTime().Ticks,
            CreatorNameIdentifier = projectWithUserInput.CreatorNameIdentifier
        };
        var result =  _projectsContext.Projects.AddIfNotExists(projectModel, project => project.Name == projectModel.Name);
        if (result == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = AlreadyTakenName
            };
            return commandResult;
        }

        try
        {
            await _projectsContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        commandResult.Data = projectModel.Id.ToString();
        return commandResult;
    }

    public async Task<List<ProjectDataModel>> GetAllProjectsAsync(List<string> userGroupIds)
    {
        var projectModelEnum = await _projectsContext.Projects
            .AsNoTracking()
            .Where(project => userGroupIds.Contains(project.GroupId.ToString()))
            .ToListAsync();
        return projectModelEnum.ConvertAll(element => element.ToProjectDataModel());
    }

    public async Task<ProjectDataModel> GetProjectAsync(string projectId, List<string> userGroupIds)
    {
        var projectModel = await _projectsContext.Projects
            .AsNoTracking()
            .Where(project => userGroupIds.Contains(project.GroupId.ToString()))
            .FirstOrDefaultAsync(project => project.Id == new Guid(projectId));
        return projectModel?.ToProjectDataModel();
    }
}