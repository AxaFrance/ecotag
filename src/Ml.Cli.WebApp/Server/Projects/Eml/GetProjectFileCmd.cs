using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using MimeKit;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Eml;

public class GetEmlCmd
{
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public GetEmlCmd(UsersRepository usersRepository, DatasetsRepository datasetsRepository, ProjectsRepository projectsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
        _projectsRepository = projectsRepository;
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

        var fileDataModel =  await _datasetsRepository.GetFileAsync(datasetId, fileId);

        var message = await MimeMessage.LoadAsync(fileDataModel.Data.Stream);
        
        var attachments = new List<MimePart> ();
        var multiparts = new List<Multipart> ();
        var iter = new MimeIterator (message);

        // collect our list of attachments and their parent multiparts
        while (iter.MoveNext ()) {
            var multipart = iter.Parent as Multipart;
            var part = iter.Current as MimePart;

            if (multipart != null && part != null && part.IsAttachment) {
                // keep track of each attachment's parent multipart
                multiparts.Add(multipart);
                attachments.Add(part);
            }
            
            
        }

        // now remove each attachment from its parent multipart...
        for (int i = 0; i < attachments.Count; i++)
        {
            multiparts[i].Remove(attachments[i]);
            var fileName = attachments[i].FileName;

            using (var stream = File.Create("C:\\test\\"+fileName))
            {
                attachments[i].Content.DecodeTo(stream);
            }
        }


        return fileDataModel;
    }
}