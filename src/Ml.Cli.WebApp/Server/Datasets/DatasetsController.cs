using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Oidc;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Datasets
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class DatasetsController : Controller
    {
        public static List<Dataset> datasets;
        public static List<EcotagFileWithBytes> files = new List<EcotagFileWithBytes>();

        private Dataset Find(string id)
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
            datasets = JsonConvert.DeserializeObject<List<Dataset>>(datasetsAsJson.ToString());
        }

        [HttpGet]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataScientist)]
        public ActionResult<IEnumerable<DatasetForList>> GetAllDatasets([FromQuery]bool? locked)
        {
            return Ok(locked.HasValue ? datasets.Where(dataset => dataset.IsLocked == locked.Value ).Select(dataset => new DatasetForList(){Classification = dataset.Classification, Id = dataset.Id,Name = dataset.Name, Type = dataset.Type, CreateDate = dataset.CreateDate,IsLocked = dataset.IsLocked, NumberFiles = dataset.Files.Count}) : datasets.Select(dataset => new DatasetForList(){Classification = dataset.Classification, Id = dataset.Id,Name = dataset.Name, Type = dataset.Type, CreateDate = dataset.CreateDate,IsLocked = dataset.IsLocked, NumberFiles = dataset.Files.Count}));
        }

        [HttpGet("{id}", Name = "GetDatasetById")]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataAnnoteur)]
        public ActionResult<Dataset> GetDataset(string id)
        {
            var dataset = Find(id);
            if (dataset == null)
            {
                return NotFound();
            }
            return Ok(dataset);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.DataScientist)]
        public ActionResult<Dataset> Create(DatasetInput newDataset)
        {
            var dataset = new Dataset()
            {
                Id = Guid.NewGuid().ToString(),
                Classification = newDataset.Classification,
                Name = newDataset.Name,
                Type = newDataset.Type,
                CreateDate = DateTime.Now,
            };
            
            datasets.Add(dataset);

            return Created(dataset.Id, Find(dataset.Id));
        }
        
        
        [HttpPost("{datasetId}/files")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.DataScientist)]
        public async Task<IActionResult> OnPostUploadAsync(string datasetId, [FromForm(Name = "files")] List<IFormFile> formFiles)
        {
            var dataset = Find(datasetId);
            foreach (var formFile in formFiles.Where(formFile => formFile.Length > 0))
            {
                var streamContent = new StreamContent(formFile.OpenReadStream());
                var bytes = await streamContent.ReadAsByteArrayAsync();
                var file = new EcotagFileWithBytes()
                {
                    Bytes = bytes,
                    FileName = formFile.FileName,
                    ContentType = formFile.ContentType,
                    DatasetId = datasetId,
                    Size = bytes.Length,
                    Id = Guid.NewGuid().ToString()
                };
                dataset.Files.Add(new EcotagFile(){Id = file.Id,ContentType = file.ContentType, FileName = file.FileName, Size = file.Size});
                files.Add(file);
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
        public ActionResult<Dataset> Lock(string datasetId)
        {
            var dataset = Find(datasetId);
            dataset.IsLocked = true;

            return NoContent();
        }
    }
}
