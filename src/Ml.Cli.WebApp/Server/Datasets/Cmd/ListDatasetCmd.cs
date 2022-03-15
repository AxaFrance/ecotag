using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets.Database;

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
    
    public async Task<IList<ListDataset>> ExecuteAsync(bool? locked, string nameIdentifier)
    {
        var user = await _usersRepository.GetUserBySubjectAsync(nameIdentifier);
        var result = await _datasetsRepository.ListDatasetAsync(locked, user.GroupIds);
        return result;
    }
}

