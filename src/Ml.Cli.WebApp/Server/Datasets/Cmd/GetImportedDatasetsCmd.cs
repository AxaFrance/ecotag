using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetImportedDatasetsCmd
{
    private readonly UsersRepository _usersRepository;
    private readonly IFileService _fileService;
    private readonly DatasetsRepository _datasetsRepository;

    public GetImportedDatasetsCmd(UsersRepository usersRepository, IFileService fileService, DatasetsRepository datasetsRepository)
    {
        _datasetsRepository = datasetsRepository;
        _usersRepository = usersRepository;
        _fileService = fileService;
    }

    public async Task<IList<string>> ExecuteAsync(string nameIdentifier)
    {
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            return new List<string>();
        }

        var datasetsNames = await _fileService.GetImportedDatasetsNamesAsync("azureblob://TransferFileStorage/input");
        var datasets = await _datasetsRepository.ListDatasetAsync(true, user.GroupIds);
        if (datasets == null)
        {
            return datasetsNames;
        }
        var filteredDatasetNames = datasetsNames.Where(dn =>
            datasets.FirstOrDefault(d => d.BlobUri.Contains($"/input/{dn}/")) == null).ToList();
        return filteredDatasetNames;
    }
}