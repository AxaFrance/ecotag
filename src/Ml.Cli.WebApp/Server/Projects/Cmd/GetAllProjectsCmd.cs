using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetAllProjectsCmd
{
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public GetAllProjectsCmd(ProjectsRepository projectsRepository, UsersRepository usersRepository)
    {
        _projectsRepository = projectsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<List<ProjectDataModel>> ExecuteAsync(string nameIdentifier)
    {
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            return new List<ProjectDataModel>();
        }
        return await _projectsRepository.GetAllProjectsAsync(user.GroupIds);
    }
}