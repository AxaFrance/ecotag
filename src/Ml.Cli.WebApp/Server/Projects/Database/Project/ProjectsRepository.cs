using System;
using System.Collections.Generic;
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
            AnnotationType = projectInput.AnnotationType,
            DatasetId = new Guid(projectInput.DatasetId),
            GroupId = new Guid(projectInput.GroupId),
            LabelsJson = JsonConvert.SerializeObject(projectInput.Labels),
            NumberCrossAnnotation = projectInput.NumberCrossAnnotation,
            CreateDate = new DateTime().Ticks,
            CreatorNameIdentifier = projectWithUserInput.CreatorNameIdentifier
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

    public async Task<ProjectDataModel> GetProjectAsync(string projectId)
    {
        var projectModel = await _projectsContext.Projects.AsNoTracking()
            .FirstOrDefaultAsync(project => project.Id == new Guid(projectId));
        return projectModel?.ToProjectDataModel();
    }
}