using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Oidc;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Datasets
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class DatasetsController : Controller
    {
        [HttpGet]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataScientist)]
        public async Task<IList<ListDataset>> GetAllDatasets([FromServices] ListDatasetCmd listDatasetCmd,[FromQuery]bool? locked)
        {
            var nameIdentifier = User.Identity.GetSubject();
            return await listDatasetCmd.ExecuteAsync(locked, nameIdentifier);
        }

        [HttpGet("{id}", Name = "GetDatasetById")]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataAnnoteur)]
        public async Task<ActionResult<GetDataset>> GetDataset([FromServices] GetDatasetCmd getDatasetCmd, string id)
        {
            var getSataset = await getDatasetCmd.ExecuteAsync(id);
            return Ok(getSataset);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.DataScientist)]
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
        [Authorize(Roles = Roles.DataScientist)]
        public async Task<IActionResult> OnPostUploadAsync([FromServices] UploadFileCmd uploadFileCmd, string datasetId, List<IFormFile> files)
        {
           // var files = Request.Form.Files;
            var nameIdentifier = User.Identity.GetSubject();
            foreach (var formFile in files.Where(formFile => formFile.Length > 0))
            {
                var stream = formFile.OpenReadStream();
                var fileId = await uploadFileCmd.ExecuteAsync(new UploadFileCmdInput()
                {
                    Name = formFile.FileName,
                    Stream = stream,
                    ContentType = formFile.ContentType,
                    DatasetId = datasetId,
                    NameIdentifier = nameIdentifier
                });
            }

            return Ok("");
        }

        [HttpGet("{datasetId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataScientist)]
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
        
     /*   [HttpDelete("{datasetId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataScientist)]
        public IActionResult DeleteFile(string datasetId, string id)
        {
            var file = files.FirstOrDefault(file => file.Id == id && file.DatasetId == datasetId);
            files.Remove(file);
            if (file != null) return NoContent();

            return NotFound();
        }*/
        
        [HttpPost("{datasetId}/lock")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.DataScientist)]
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
