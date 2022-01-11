using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ml.Cli.WebApp.Server.Datasets
{
    
    public class EcotagFile
    {
        public string Id { get; set; }
        
        public string DatasetId { get; set; }
        public byte[] Bytes { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }


    [Route("api/server/[controller]")]
    public class DatasetFilesController : Controller
    {

        private static List<EcotagFile> files = new List<EcotagFile>();

        [HttpPost("{datasetId}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> OnPostUploadAsync(string datasetId, [FromForm(Name = "files")] List<IFormFile> formFiles)
        {
            foreach (var formFile in formFiles.Where(formFile => formFile.Length > 0))
            {
                
                var streamContent = new StreamContent(formFile.OpenReadStream());
                var file = new EcotagFile
                {
                    Bytes = await streamContent.ReadAsByteArrayAsync(),
                    FileName = formFile.FileName,
                    ContentType = formFile.ContentType,
                    Id = Guid.NewGuid().ToString()
                };
                files.Add(file);
            }

            return Ok();
        }

        [HttpGet("{id}")]
        [ResponseCache(Duration = 1)]
        public IActionResult GetFile(string id)
        {
            var file = files.FirstOrDefault(file => file.Id == id);
            if (file != null) return File(file.Bytes, file.ContentType, file.FileName);

            return NotFound();

        }
    }
}
