using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

namespace AxaGuilDEv.Ecotag.Server.Groups.Cmd;

public class GetAllGroupsCmd
{
    private readonly GroupsRepository _groupsRepository;
    private readonly UsersRepository _usersRepository;

    public GetAllGroupsCmd(GroupsRepository groupsRepository, UsersRepository usersRepository)
    {
        _groupsRepository = groupsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<List<GroupDataModel>> ExecuteAsync(bool? mine, string nameIdentifier)
    {
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);

        if (user == null) return new List<GroupDataModel>();

        return await _groupsRepository.GetAllGroupsAsync(mine, user.GroupIds);
    }
}