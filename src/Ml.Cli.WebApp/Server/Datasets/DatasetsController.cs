using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Projects;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Datasets
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class DatasetsController : Controller
    {
        private static List<Dataset> datasets;

        private Dataset find(string id)
        {
            return datasets.Find(currentDataset => currentDataset.Id.Equals(id));
        }
        
        public DatasetsController()
        {
            if (datasets != null) return;
            Console.WriteLine("Loading datasets...");
            string datasetsAsString = System.IO.File.ReadAllText("./Server/Datasets/mocks/datasets.json");
            var datasetsAsJsonFile = JsonDocument.Parse(datasetsAsString);
            var datasetsAsJson = datasetsAsJsonFile.RootElement.GetProperty("datasets");
            datasets = JsonConvert.DeserializeObject<List<Dataset>>(datasetsAsJson.ToString());
        }

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public ActionResult<IEnumerable<Dataset>> GetAllDatasets()
        {
            return Ok(datasets);
        }

        [HttpGet("{id}", Name = "GetDatasetById")]
        [ResponseCache(Duration = 1)]
        public ActionResult<Dataset> GetDataset(string id)
        {
            var dataset = find(id);
            if (dataset == null)
            {
                return NotFound();
            }
            return Ok(dataset);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
            
            return find(dataset.Id);
        }
    }
}
