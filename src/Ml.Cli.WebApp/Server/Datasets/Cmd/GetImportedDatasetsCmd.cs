using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.BlobStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetImportedDatasetsCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly ITransferService _transferService;

    public GetImportedDatasetsCmd(UsersRepository usersRepository, ITransferService transferService)
    {
        _usersRepository = usersRepository;
        _transferService = transferService;
    }

    public async Task<IList<string>> ExecuteAsync(string nameIdentifier)
    {
        var user = await _usersRepository.GetUserByNameIdentifierAsync(nameIdentifier);
        if (user == null)
        {
            return new List<string>();
        }

        var datasetsNames = await _transferService.GetImportedDatasetsNamesAsync("input");
        return datasetsNames;
    }
}