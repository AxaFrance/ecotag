using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetAllUsersCmd
{
    private readonly IUsersRepository _usersRepository;

    public GetAllUsersCmd(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    public async Task<List<UserDataModel>> ExecuteAsync()
    {
        return await _usersRepository.GetAllUsersAsync();
    }
}