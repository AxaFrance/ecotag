using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.BasePath;

namespace Ml.Cli.WebApp.Controllers
{
    [ApiController]
    [Route("api/files")]
    public class FilesController : ControllerBase
    {
        private readonly IFileLoader _fileLoader;
        private readonly IBasePath _basePath;

        public FilesController(IFileLoader fileLoader, IBasePath basePath)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ShowFile(string id)
        {
            var elementPath = HttpUtility.ParseQueryString(id).Get("value");
            if (!_basePath.IsPathSecure(elementPath))
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
