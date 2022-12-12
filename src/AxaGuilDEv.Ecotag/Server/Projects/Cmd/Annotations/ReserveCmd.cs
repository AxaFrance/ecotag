using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;

public class ReserveCmd
{
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    private readonly AnnotationsRepository _annotationsRepository;
    private readonly DatasetsRepository _datasetsRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public ReserveCmd(UsersRepository usersRepository,
        DatasetsRepository datasetsRepository,
        ProjectsRepository projectsRepository,
        AnnotationsRepository annotationsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
        _projectsRepository = projectsRepository;
        _annotationsRepository = annotationsRepository;
    }

    public async Task<ResultWithError<IList<ReserveOutput>, ErrorResult>> ExecuteAsync(string projectId, string fileId,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<IList<ReserveOutput>, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);

        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);

        var project = projectResult.Data;
        var datasetId = project.DatasetId;
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

        var reservations = await _annotationsRepository.ReserveAsync(projectId, datasetId, nameIdentifier, fileId,
            project.NumberCrossAnnotation);
        commandResult.Data = reservations;
        return commandResult;
    }
}