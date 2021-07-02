using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.BasePath;
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
    }
}
