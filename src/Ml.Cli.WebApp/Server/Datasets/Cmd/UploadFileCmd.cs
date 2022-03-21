using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public record UploadFile
{
    [Required]
    [MaxLength(1024)]
    [MinLength(3)]
    public string Name { get; set; }
    
    [Required]
    [MaxLength(256)]
    [MinLength(3)]
    public string ContentType { get; set; }
    
    [Required]
    public Stream Stream { get; set; }
}


public record UploadFileCmdInput
{
    [Required]
    public IList<UploadFile> Files { get; set; }
    [Required] 
    [RegularExpression("(?im)^[{(]?[0-9A-F]{8}[-]?(?:[0-9A-F]{4}[-]?){3}[0-9A-F]{12}[)}]?$")]
    public string DatasetId { get; set; }
    [MaxLength(32)]
    [MinLength(1)]
    public string NameIdentifier { get; set; }
}


public class UploadFileCmd
{
    private readonly IUsersRepository _usersRepository;
    private readonly DatasetsRepository _datasetsRepository;
    public const string FileTooLarge = "FileTooLarge";
    public const int Mb = 1048576;
    public UploadFileCmd(IUsersRepository usersRepository, DatasetsRepository datasetsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
    }
    
    public async Task<ResultWithError<IList<ResultWithError<string, ErrorResult>>, ErrorResult>> ExecuteAsync(UploadFileCmdInput uploadFileCmdInput)
    {
        var commandResult = new ResultWithError<IList<ResultWithError<string, ErrorResult>>, ErrorResult>();
        
        var validationResult = new Validation().Validate(uploadFileCmdInput);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }
        
        var nameIdentifier = uploadFileCmdInput.NameIdentifier;
        var user = await _usersRepository.GetUserBySubjectWithGroupIdsAsync(nameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
            };
            return commandResult;
        }

        var datasetId = uploadFileCmdInput.DatasetId;
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        
        foreach (var file in uploadFileCmdInput.Files)
        {
            var fileValidationResult = new Validation().Validate(file);
            if (!fileValidationResult.IsSuccess)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = InvalidModel,
                    Error = validationResult.Errors
                };
                return commandResult;
            }

            var extension = Path.GetExtension(file.Name)?.ToLower();
            
            if (datasetInfo.Type == DatasetTypeEnumeration.Image.ToString())
            {
                var imageExtention = new List<string>() { ".png", ".jpg", ".jpeg", ".tif", ".tiff" };
                if (!imageExtention.Contains(extension))
                {
                    commandResult.Error = new ErrorResult { Key = InvalidModel };
                    return commandResult;
                }
            }
            else
            {
                var imageExtention = new List<string>() { ".txt" };
                if (!imageExtention.Contains(extension))
                {
                    commandResult.Error = new ErrorResult { Key = InvalidModel };
                    return commandResult;
                }
            }

            if (file.Stream.Length < 32 * Mb) continue;
            commandResult.Error = new ErrorResult { Key = FileTooLarge };
            return commandResult;
        }
        
        if (datasetInfo.IsLocked)
        {
            commandResult.Error = new ErrorResult
            {
                Key = DatasetLocked,
            };
            return commandResult;
        }

        if (!user.GroupIds.Contains(datasetInfo.GroupId.ToString()))
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotInGroup,
            };
            return commandResult;
        }
        
        var results = (from file in uploadFileCmdInput.Files let fileName = file.Name let stream = file.Stream select _datasetsRepository.CreateFileAsync(datasetId, stream, fileName, file.ContentType, nameIdentifier)).ToList();
        Task.WaitAll(results.ToArray());
        commandResult.Data = results.Select(r => r.Result).ToList();
        return commandResult;
    }

    public const string DatasetLocked = "DatasetLocked";

    public const string UserNotInGroup = "UserNotInGroup";

    public const string UserNotFound = "UserNotFound";

    public const string InvalidModel = "InvalidModel";
}