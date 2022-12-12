using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Projects.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd;

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
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return new List<ProjectDataModel>();
        return await _projectsRepository.GetAllProjectsAsync(user.GroupIds);
    }
}