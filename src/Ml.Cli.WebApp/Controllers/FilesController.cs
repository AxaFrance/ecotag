using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Paths;

namespace Ml.Cli.WebApp.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FilesController : ControllerBase
    {
        private readonly IFileLoader _fileLoader;
        private readonly BasePath _basePath;
        private readonly ComparesPaths _comparesPaths;

        public FilesController(IFileLoader fileLoader, BasePath basePath, ComparesPaths comparesPaths)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
            _comparesPaths = comparesPaths;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ShowFile(string id)
        {
            var encodedPlusSign = "%2B";
            var elementPath = HttpUtility.ParseQueryString(id).Get("value");
            elementPath = elementPath.Replace(encodedPlusSign, "+");    //normal plus signs have to be recovered (they were previously encoded to prevent being decoded as spaces)
            if (!_basePath.IsPathSecure(elementPath) && !_comparesPaths.IsPathContained(elementPath))
            {
                return BadRequest();
            }

            var stream = _fileLoader.OpenRead(elementPath);
            if (stream == null)
                return NotFound(); // returns a NotFoundResult with Status404NotFound response.

            var contentType = GetContentType(elementPath);
            return File(stream, contentType); // returns a FileStreamResult
        }

        public static string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(path, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }
    }
}
