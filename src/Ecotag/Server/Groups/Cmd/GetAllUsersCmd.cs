using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

namespace AxaGuilDEv.Ecotag.Server.Groups.Cmd;

public class GetAllUsersCmd
{
    private readonly UsersRepository _usersRepository;

    public GetAllUsersCmd(UsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    public async Task<List<UserDataModel>> ExecuteAsync()
    {
        return await _usersRepository.GetAllUsersAsync();
    }
}