using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class ListDatasetCmd
{
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IUsersRepository _usersRepository;

    public ListDatasetCmd(DatasetsRepository datasetsRepository, IUsersRepository usersRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
    }
    
    public async Task<IList<ListDataset>> ExecuteAsync(bool? locked, string nameIdentifier)
    {
        var user = await _usersRepository.GetUserBySubjectAsync(nameIdentifier);

        if (user == null)
        {
            return new List<ListDataset>();
        }

        var result = await _datasetsRepository.ListDatasetAsync(locked, user.GroupIds);
        return result;
    }
}

