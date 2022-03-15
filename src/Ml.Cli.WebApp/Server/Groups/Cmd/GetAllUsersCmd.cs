using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetAllUsersCmd
{
    private readonly IUsersRepository _usersRepository;

    public GetAllUsersCmd(IUsersRepository usersRepository)
    {
        _usersRepository = usersRepository;
    }

    public async Task<List<ListUserDataModel>> ExecuteAsync()
    {
        return await _usersRepository.GetAllUsersAsync();
    }
}