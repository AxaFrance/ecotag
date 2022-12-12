using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.FileStorage;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Projects.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd;

public class GetProjectFileCmd
{
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly DocumentConverterToPdf _documentConverterToPdf;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public GetProjectFileCmd(UsersRepository usersRepository, DatasetsRepository datasetsRepository,
        ProjectsRepository projectsRepository, DocumentConverterToPdf documentConverterToPdf)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
        _projectsRepository = projectsRepository;
        _documentConverterToPdf = documentConverterToPdf;
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> ExecuteAsync(string projectId, string fileId,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<FileServiceDataModel, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);

        var project = projectResult.Data;
        var datasetId = project.DatasetId;
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);
        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var file = await _datasetsRepository.GetFileAsync(datasetId, fileId, true);
        return file;
    }
}