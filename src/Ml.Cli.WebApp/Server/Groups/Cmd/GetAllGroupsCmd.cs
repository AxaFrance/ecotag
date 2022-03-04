using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups.Cmd;

public class GetAllGroupsCmd
{
    private readonly IGroupsRepository _groupsRepository;

    public GetAllGroupsCmd(IGroupsRepository groupsRepository)
    {
        _groupsRepository = groupsRepository;
    }

    public async Task<List<GroupDataModel>> ExecuteAsync()
    {
        return await _groupsRepository.GetAllGroupsAsync();
    }
}