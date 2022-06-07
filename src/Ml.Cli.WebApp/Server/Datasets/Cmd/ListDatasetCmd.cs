using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class ListDatasetCmd
{
    private readonly DatasetsRepository _datasetsRepository;
    private readonly UsersRepository _usersRepository;

    public ListDatasetCmd(DatasetsRepository datasetsRepository, UsersRepository usersRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }

    public async Task<IList<ListDataset>> ExecuteAsync(DatasetLockedEnumeration? locked, string nameIdentifier)
    {
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);

        if (user == null) return new List<ListDataset>();

        var result = await _datasetsRepository.ListDatasetAsync(locked, user.GroupIds);
        return result;
    }
}