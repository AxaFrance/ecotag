using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Local.Paths;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Local;

[ApiController]
[Route("api/local/[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class AnnotationsController : ControllerBase
{
    private readonly BasePath _basePath;
    private readonly IFileLoader _fileLoader;

    public AnnotationsController(IFileLoader fileLoader, BasePath basePath)
    {
        _fileLoader = fileLoader;
        _basePath = basePath;
    }

    [HttpGet("{id}")]
    [ResponseCache(Duration = 1)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBody(string id)
    {
        var elementPath = Encoding.UTF8.GetString(Convert.FromBase64String(id));
        if (!_basePath.IsPathSecure(elementPath)) return BadRequest();

        var result = await _fileLoader.ReadAllTextInFileAsync(elementPath);
        var httpResult = JsonConvert.DeserializeObject<Cli.Program.HttpResult>(result);
        return Ok(httpResult);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SaveAnnotation([FromBody] DatasetInfo datasetData)
    {
        if (datasetData?.DatasetLocation == null || datasetData.Annotation.Equals(null)) return BadRequest();

        if (!_basePath.IsPathSecure(datasetData.DatasetLocation)) return BadRequest();

        var file = await _fileLoader.ReadAllTextInFileAsync(datasetData.DatasetLocation);
        var fileContent = JsonConvert.DeserializeObject<DatasetFileContent>(file);
        var foundToken = Array.Find(fileContent.JsonTokens, token => token.FileName == datasetData.FileName);
        if (foundToken == null) return BadRequest();
        var annotation = foundToken.Annotations;
        if (annotation != string.Empty)
        {
            var newAnnotation = ", " + datasetData.Annotation.ToString();
            foundToken.Annotations = annotation.Insert(annotation.Length - 1, newAnnotation);
        }
        else
        {
            foundToken.Annotations = "[" + datasetData.Annotation.ToString() + "]";
        }

        var result = JsonConvert.SerializeObject(fileContent, Formatting.Indented);
        await _fileLoader.WriteAllTextInFileAsync(datasetData.DatasetLocation, result);
        return Ok();
    }

    public class DatasetToken
    {
        public string FileName { get; set; }
        public string FileDirectory { get; set; }
        public string ImageDirectory { get; set; }
        public string FrontDefaultStringsMatcher { get; set; }
        public string Annotations { get; set; }
    }

    public class DatasetFileContent
    {
        public DatasetFileContent(string datasetLocation, DatasetToken[] array)
        {
            DatasetLocation = datasetLocation;
            JsonTokens = array;
        }

        public string DatasetLocation { get; set; }
        public string AnnotationType { get; set; }
        public string Configuration { get; set; }

        [JsonProperty(PropertyName = "Content")]
        public DatasetToken[] JsonTokens { get; set; }
    }

    public class DatasetInfo
    {
        public DatasetInfo(string datasetLocation, string fileName, dynamic annotation)
        {
            DatasetLocation = datasetLocation;
            FileName = fileName;
            Annotation = annotation;
        }

        public string DatasetLocation { get; set; }
        public string FileName { get; set; }
        public dynamic Annotation { get; set; }
    }
}