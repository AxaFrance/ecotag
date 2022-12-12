using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.FileStorage;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using Microsoft.Extensions.Options;

namespace AxaGuilDEv.Ecotag.Server.Datasets.Cmd;

public class GetImportedDatasetsCmd
{
    private readonly DatasetsRepository _datasetsRepository;
    private readonly IOptions<DatasetsSettings> _datasetsSettings;
    private readonly IFileService _fileService;
    private readonly UsersRepository _usersRepository;

    public GetImportedDatasetsCmd(UsersRepository usersRepository, IFileService fileService,
        DatasetsRepository datasetsRepository, IOptions<DatasetsSettings> datasetsSettings)
    {
        _datasetsRepository = datasetsRepository;
        _datasetsSettings = datasetsSettings;
        _usersRepository = usersRepository;
        _fileService = fileService;
    }

    public async Task<IList<string>> ExecuteAsync(string nameIdentifier)
    {
        if (!_datasetsSettings.Value.IsBlobTransferActive) return new List<string>();

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return new List<string>();

        var datasetsNames = await _fileService.GetImportedDatasetsNamesAsync("azureblob://TransferFileStorage/input");
        var datasets = await _datasetsRepository.ListDatasetAsync(null, user.GroupIds);
        if (datasets == null) return datasetsNames;

        return datasetsNames.Where(datasetsName => datasets.Count(d => d.BlobUri.EndsWith($"/{datasetsName}")) == 0)
            .ToList();
    }
}