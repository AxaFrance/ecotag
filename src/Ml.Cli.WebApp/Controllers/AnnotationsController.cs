using System;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.BasePath;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.WebApp.Controllers
{
    [ApiController]
    [Route("api/annotations")]
    public class AnnotationsController : ControllerBase
    {
        private readonly IFileLoader _fileLoader;
        private readonly IBasePath _basePath;

        public AnnotationsController(IFileLoader fileLoader, IBasePath basePath)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
        }

        public class DatasetToken
        {
            public string FileName { get; set; }
            public string FileDirectory { get; set; }
            public string ImageDirectory { get; set; }
            public dynamic Annotations { get; set; }
        }

        public class DatasetFileContent
        {
            public string DatasetLocation { get; set; }

            [JsonProperty(PropertyName = "Content")]
            public DatasetToken[] JsonTokens { get; set; }

            public DatasetFileContent(string datasetLocation, DatasetToken[] array)
            {
                DatasetLocation = datasetLocation;
                JsonTokens = array;
            }
        }

        public class DatasetInfo
        {
            public string DatasetLocation { get; set; }
            public string AnnotationType { get; set; }
            public string FileName { get; set; }
            public dynamic Annotation { get; set; }

            public DatasetInfo(string datasetLocation, string annotationType, string fileName, dynamic annotation)
            {
                DatasetLocation = datasetLocation;
                AnnotationType = annotationType;
                FileName = fileName;
                Annotation = annotation;
            }
        }

        [HttpGet("{filePath}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBody(string filePath)
        {
            var elementPath = HttpUtility.ParseQueryString(filePath).Get("filePath");
            if (!_basePath.IsPathSecure(elementPath))
            {
                return BadRequest();
            }

            var result = await _fileLoader.ReadAllTextInFileAsync(elementPath);
            var httpResult = JsonConvert.DeserializeObject<Cli.Program.HttpResult>(result);
            return Ok(httpResult);
        }

        [HttpPost("save")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SaveAnnotation([FromBody] DatasetInfo datasetData)
        {
            if (datasetData == null || (datasetData.AnnotationType == null || datasetData.DatasetLocation == null ||
                                        datasetData.Annotation.Equals(null)))
            {
                return BadRequest();
            }

            if (!_basePath.IsPathSecure(datasetData.DatasetLocation))
            {
                return BadRequest();
            }

            var file = await _fileLoader.ReadAllTextInFileAsync(datasetData.DatasetLocation);
            var fileContent = JsonConvert.DeserializeObject<DatasetFileContent>(file);
            var foundToken = Array.Find(fileContent.JsonTokens, token => token.FileName == datasetData.FileName);
            if (foundToken != null)
            {
                var nbAnnotations = ((JObject) foundToken.Annotations).Count;
                foundToken.Annotations.Add($"annotation{nbAnnotations}", datasetData.Annotation.ToString());
                var result = JsonConvert.SerializeObject(fileContent, Formatting.Indented);
                await _fileLoader.WriteAllTextInFileAsync(datasetData.DatasetLocation, result);
                return Ok();
            }

            return BadRequest();
        }
    }
}