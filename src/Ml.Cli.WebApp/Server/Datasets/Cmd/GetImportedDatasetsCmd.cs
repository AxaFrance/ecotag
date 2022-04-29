using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.BlobStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetImportedDatasetsCmd
{
    private const string UserNotFound = "UserNotFound";
    private readonly UsersRepository _usersRepository;
    private readonly ITransferService _transferService;

    public GetImportedDatasetsCmd(UsersRepository usersRepository, ITransferService transferService)
    {
        _usersRepository = usersRepository;
        _transferService = transferService;
    }

    public async Task<ResultWithError<IList<string>, ErrorResult>> ExecuteAsync(string nameIdentifier)
    {
        var commandResult = new ResultWithError<IList<string>, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierAsync(nameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound
            };
            return commandResult;
        }

        var datasetsNames = await _transferService.GetImportedDatasetsNamesAsync("input");
        commandResult.Data = datasetsNames;
        return commandResult;
    }
}