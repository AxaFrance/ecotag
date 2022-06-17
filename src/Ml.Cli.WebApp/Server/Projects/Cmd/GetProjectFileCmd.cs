using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetProjectFileCmd
{
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly DocumentConverterToPdf _documentConverterToPdf;
    private readonly UsersRepository _usersRepository;

    public GetProjectFileCmd(UsersRepository usersRepository, DatasetsRepository datasetsRepository, ProjectsRepository projectsRepository, DocumentConverterToPdf documentConverterToPdf)
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

       var file= await _datasetsRepository.GetFileAsync(datasetId, fileId);

       var extentions = new List<string>() { ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".tif", ".tiff", ".rtf", ".odt", ".ods", ".odp" };
       if (!file.IsSuccess) return file;
       if (!extentions.Contains(Path.GetExtension(file.Data.Name))) return file;
       var newStream = await _documentConverterToPdf.Convert(file.Data.Name, file.Data.Stream);
       var res = new ResultWithError<FileServiceDataModel, ErrorResult>
       {
           Data = new FileServiceDataModel()
           {
               Stream = newStream,
               Length = newStream.Position,
               Name = $"{file.Data.Name}.pdf",
               ContentType = "application/pdf"
           }
       };
       return res;

    }
    

}