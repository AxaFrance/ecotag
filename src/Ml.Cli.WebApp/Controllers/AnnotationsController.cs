using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.BasePath;
using Ml.Cli.WebApp.Controllers.AnnotationTypes;
using Newtonsoft.Json;

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
        
        public class DatasetInfo
        {
            public string DatasetLocation { get; set; }
            public string AnnotationType { get; set; }
            public dynamic Annotation  { get; set; }

            public DatasetInfo(string datasetLocation, string annotationType, dynamic annotation)
            {
                DatasetLocation = datasetLocation;
                AnnotationType = annotationType;
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
            if (datasetData == null || (datasetData.AnnotationType == null || datasetData.DatasetLocation == null || datasetData.Annotation == null))
            {
                return BadRequest();
            }

            if (!_basePath.IsPathSecure(datasetData.DatasetLocation))
            {
                return BadRequest();
            }
            
            switch (datasetData.AnnotationType)
            {
                case "Ocr":
                    var annotationObject = JsonConvert.DeserializeObject<Ocr>(datasetData.Annotation.ToString());
                    //TODO: récupérer le contenu et le stocker dans la partie Annotations de l'objet ayant le bon FileName
                    break;
                case "Cropping":
                    break;
                case "Rotation":
                    break;
                case "TagOverText":
                    break;
                case "TagOverTextLabel":
                    break;
            }

            return Ok();
        }
    }
}
