using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetAllGroupsCmd
{
    private readonly IGroupsRepository _groupsRepository;
    private readonly IUsersRepository _usersRepository;

    public GetAllGroupsCmd(IGroupsRepository groupsRepository, IUsersRepository usersRepository)
    {
        _groupsRepository = groupsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<List<GroupDataModel>> ExecuteAsync(bool? mine, string nameIdentifier)
    {
        var user = await _usersRepository.GetUserBySubjectAsync(nameIdentifier);

        if (user == null)
        {
            return new List<GroupDataModel>();
        }
        
        return await _groupsRepository.GetAllGroupsAsync(mine, user.GroupIds);
    }
}