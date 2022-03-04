using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetAllProjectsCmd
{
    private readonly IProjectsRepository _projectsRepository;

    public GetAllProjectsCmd(IProjectsRepository projectsRepository)
    {
        _projectsRepository = projectsRepository;
    }

    public async Task<List<ProjectDataModel>> ExecuteAsync()
    {
        return await _projectsRepository.GetAllProjectsAsync();
    }
}