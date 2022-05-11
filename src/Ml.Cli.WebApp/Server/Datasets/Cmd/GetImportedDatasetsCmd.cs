using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetImportedDatasetsCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly IFileService _fileService;

    public GetImportedDatasetsCmd(UsersRepository usersRepository, IFileService fileService)
    {
        _usersRepository = usersRepository;
        _fileService = fileService;
    }

    public async Task<IList<string>> ExecuteAsync(string nameIdentifier)
    {
        var user = await _usersRepository.GetUserByNameIdentifierAsync(nameIdentifier);
        if (user == null)
        {
            return new List<string>();
        }

        var datasetsNames = await _fileService.GetImportedDatasetsNamesAsync("TransferFileStorage", "input");
        return datasetsNames;
    }
}