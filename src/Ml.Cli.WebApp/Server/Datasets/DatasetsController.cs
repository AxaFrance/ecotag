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
using Ml.Cli.WebApp.Server.Oidc;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Datasets
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class DatasetsController : Controller
    {
        public static List<GetDataset> datasets;
        public static List<EcotagFileWithBytes> files = new List<EcotagFileWithBytes>();

        private GetDataset Find(string id)
        {
            return datasets.Find(currentDataset => currentDataset.Id.Equals(id));
        }
        
        public DatasetsController()
        {
            if (datasets != null) return;
            Console.WriteLine("Loading datasets...");
            var datasetsAsString = System.IO.File.ReadAllText("./Server/Datasets/mocks/datasets.json");
            var datasetsAsJsonFile = JsonDocument.Parse(datasetsAsString);
            var datasetsAsJson = datasetsAsJsonFile.RootElement.GetProperty("datasets");
            datasets = JsonConvert.DeserializeObject<List<GetDataset>>(datasetsAsJson.ToString());
        }

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
        public async Task<IActionResult> OnPostUploadAsync([FromServices] UploadFileCmd uploadFileCmd, string datasetId)
        {
            var files = Request.Form.Files;
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
        public IActionResult GetDatasetFile(string datasetId, string id)
        {
            var file = files.FirstOrDefault(file => file.Id == id && file.DatasetId == datasetId);
            if (file != null) return File(file.Bytes, file.ContentType, file.FileName);

            return NotFound();
        }
        
        [HttpDelete("{datasetId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataScientist)]
        public IActionResult DeleteFile(string datasetId, string id)
        {
            var file = files.FirstOrDefault(file => file.Id == id && file.DatasetId == datasetId);
            files.Remove(file);
            if (file != null) return NoContent();

            return NotFound();
        }
        
        [HttpPost("{datasetId}/lock")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.DataScientist)]
        public ActionResult<GetDataset> Lock(string datasetId)
        {
            var dataset = Find(datasetId);
            dataset.IsLocked = true;

            return NoContent();
        }
    }
}
