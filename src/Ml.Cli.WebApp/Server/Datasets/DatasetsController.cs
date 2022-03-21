using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Oidc;

namespace Ml.Cli.WebApp.Server.Datasets
{
    [Route("api/server/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.DataScientist)]
    public class DatasetsController : Controller
    {
        [HttpGet]
        [ResponseCache(Duration = 1)]
        
        public async Task<IList<ListDataset>> GetAllDatasets([FromServices] ListDatasetCmd listDatasetCmd,[FromQuery]bool? locked)
        {
            var nameIdentifier = User.Identity.GetSubject();
            return await listDatasetCmd.ExecuteAsync(locked, nameIdentifier);
        }

        [HttpGet("{id}", Name = "GetDatasetById")]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<GetDataset>> GetDataset([FromServices] GetDatasetCmd getDatasetCmd, string id)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var getDatasetResult = await getDatasetCmd.ExecuteAsync(id, nameIdentifier);

            if (!getDatasetResult.IsSuccess)
            {
                var errorKey = getDatasetResult.Error.Key;
                return errorKey switch
                {
                    GetDatasetCmd.DatasetNotFound => NotFound(),
                    _ => Forbid()
                };
            }
            
            return Ok(getDatasetResult.Data);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Create([FromServices] CreateDatasetCmd createDatasetCmd, DatasetInput datasetInput)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var commandResult = await createDatasetCmd.ExecuteAsync(new CreateDatasetCmdInput()
            {
                CreatorNameIdentifier = nameIdentifier,
                Classification = datasetInput.Classification,
                Name = datasetInput.Name,
                Type = datasetInput.Type,
                GroupId = datasetInput.GroupId
            });
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }
            
            return Created(commandResult.Data, commandResult.Data);
        }
        
        [HttpPost("{datasetId}/files")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> OnPostUploadAsync([FromServices] UploadFileCmd uploadFileCmd, string datasetId, List<IFormFile> files)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var uploadfiles = new List<UploadFile>();
            foreach (var formFile in files.Where(formFile => formFile.Length > 0))
            {
                var stream = formFile.OpenReadStream();
                var uploadFile = new UploadFile()
                {
                    Name = formFile.FileName,
                    Stream = stream,
                    ContentType = formFile.ContentType,
                };
                uploadfiles.Add(uploadFile);
            }
            
            var uploadFileResults = await uploadFileCmd.ExecuteAsync(new UploadFileCmdInput()
            {
                Files = uploadfiles, 
                DatasetId = datasetId,
                NameIdentifier = nameIdentifier
            });

            if (!uploadFileResults.IsSuccess)
            {
                var errorKey = uploadFileResults.Error.Key;
                return errorKey switch
                {
                    UploadFileCmd.DatasetLocked => BadRequest(uploadFileResults.Error),
                    UploadFileCmd.InvalidModel => BadRequest(uploadFileResults.Error),
                    UploadFileCmd.FileTooLarge => BadRequest(uploadFileResults.Error),
                    _ => Forbid()
                };
            }

            return Ok(uploadFileResults.Data);
        }

        [HttpGet("{datasetId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        public async Task<IActionResult> GetDatasetFile([FromServices] GetFileCmd getFileCmd, string datasetId, string id)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var result = await getFileCmd.ExecuteAsync(datasetId, id, nameIdentifier);

            if (!result.IsSuccess)
            {
                var errorKey = result.Error.Key;
                return errorKey switch
                {
                    FileService.FileNameMissing => NotFound(),
                    GetFileCmd.DatasetNotFound => NotFound(),
                    _ => Forbid()
                };
            }
            var file = result.Data;
            return File(file.Stream, file.ContentType, file.Name);
        }
        
        [HttpDelete("{datasetId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        public async Task<IActionResult> DeleteFile([FromServices] DeleteFileCmd deleteFileCmd,string datasetId, string id)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var result = await deleteFileCmd.ExecuteAsync(datasetId, id, nameIdentifier);

            if (!result.IsSuccess)
            {
                var errorKey = result.Error.Key;
                return errorKey switch
                {
                    DeleteFileCmd.DatasetNotFound => NotFound(),
                    DatasetsRepository.FileNotFound => NotFound(),
                    _ => Forbid()
                };
            }
            
            return NoContent();
        }
        
        [HttpPost("{datasetId}/lock")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Lock([FromServices] LockDatasetCmd lockDatasetCmd, string datasetId)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var result = await lockDatasetCmd.ExecuteAsync(datasetId, nameIdentifier);

            if (!result.IsSuccess)
            {
                var errorKey = result.Error.Key;
                return errorKey switch
                {
                    LockDatasetCmd.DatasetNotFound => NotFound(),
                    _ => Forbid()
                };
            }
            
            return NoContent();
        }
    }
}
