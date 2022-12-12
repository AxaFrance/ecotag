using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;

namespace AxaGuilDEv.Ecotag.Server.Datasets.Cmd;

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

        var lockedItems = new List<DatasetLockedEnumeration>();
        if (locked is DatasetLockedEnumeration.Locked)
        {
            lockedItems.Add(DatasetLockedEnumeration.Locked);
            lockedItems.Add(DatasetLockedEnumeration.LockedAndWorkInProgress);
        }
        else if (locked.HasValue)
        {
            lockedItems.Add(locked.Value);
        }

        var result = await _datasetsRepository.ListDatasetAsync(lockedItems, user.GroupIds);
        return result;
    }
}