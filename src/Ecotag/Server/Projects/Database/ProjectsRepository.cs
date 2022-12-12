using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace AxaGuilDEv.Ecotag.Server.Projects.Database;

public class ProjectsRepository
{
    public const string AlreadyTakenName = "AlreadyTakenName";
    public const string Forbidden = "Forbidden";
    public const string NotFound = "NotFound";
    private readonly IMemoryCache _cache;
    private readonly ProjectContext _projectsContext;

    public ProjectsRepository(ProjectContext projectsContext, IMemoryCache cache)
    {
        _projectsContext = projectsContext;
        _cache = cache;
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateProjectAsync(
        CreateProjectWithUserInput projectWithUserInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var projectInput = projectWithUserInput.CreateProjectInput;
        var projectModel = new ProjectModel
        {
            Name = projectInput.Name,
            AnnotationType = projectInput.AnnotationType.ToAnnotationType(),
            DatasetId = new Guid(projectInput.DatasetId),
            GroupId = new Guid(projectInput.GroupId),
            LabelsJson = JsonSerializer.Serialize(projectInput.Labels),
            NumberCrossAnnotation = projectInput.NumberCrossAnnotation,
            CreateDate = DateTime.Now.Ticks,
            CreatorNameIdentifier = projectWithUserInput.CreatorNameIdentifier
        };
        var result =
            _projectsContext.Projects.AddIfNotExists(projectModel, project => project.Name == projectModel.Name);
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
            .OrderByDescending(p => p.CreateDate)
            .ToListAsync();
        return projectModelEnum.ConvertAll(element => element.ToProjectDataModel());
    }

    public async Task<ResultWithError<ProjectDataModel, ErrorResult>> GetProjectAsync(string projectId,
        List<string> userGroupIds)
    {
        var commandResult = new ResultWithError<ProjectDataModel, ErrorResult>();

        var cacheEntry = await _cache.GetOrCreateAsync($"GetProjectAsync({projectId})", async entry =>
        {
            var projectModel = await _projectsContext.Projects
                .AsNoTracking()
                .FirstOrDefaultAsync(project => project.Id == new Guid(projectId));
            return projectModel;
        });
        if (cacheEntry == null) return commandResult.ReturnError(NotFound);
        if (!userGroupIds.Contains(cacheEntry.GroupId.ToString())) return commandResult.ReturnError(Forbidden);
        commandResult.Data = cacheEntry.ToProjectDataModel();
        return commandResult;
    }
}