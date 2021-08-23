using System.IO;
using System.Linq;
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
        private readonly FilesPaths _filesPaths;

        public FilesController(IFileLoader fileLoader, BasePath basePath, FilesPaths filesPaths)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
            _filesPaths = filesPaths;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetFiles()
        {
            var callingUrl = Request.GetTypedHeaders().Referer.ToString();
            var fileType = callingUrl.Split('/').Last();
            var paths = fileType == "compare" ? _filesPaths.ComparePaths : _filesPaths.DatasetPaths;
            if (paths == string.Empty)
            {
                return BadRequest($"{fileType} repositories paths is unspecified.");
            }

            var jsonExtension = ".json";
            var pathsArray = paths.Split(Separators.CommaSeparator);
            var fullyQualifiedPaths =
                pathsArray.Select(path => Path.IsPathRooted(path) ? path : Path.Combine(_basePath.Path, path));

            var jsonsList = fullyQualifiedPaths
                .SelectMany(_fileLoader.EnumerateFiles)
                .Where(file => Path.GetExtension(file) == jsonExtension);

            return Ok(jsonsList);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ShowFile(string id)
        {
            var encodedPlusSign = "%2B";
            var elementPath = HttpUtility.ParseQueryString(id).Get("value");
            //normal plus signs have to be recovered (they were previously encoded to prevent being decoded as spaces)
            elementPath =
                elementPath.Replace(encodedPlusSign, "+");
            if (!_basePath.IsPathSecure(elementPath) && !_filesPaths.IsPathContained(elementPath, true) &&
                !_filesPaths.IsPathContained(elementPath, false))
            {
                return BadRequest();
            }

            var stream = _fileLoader.OpenRead(elementPath);
            if (stream == null)
                return NotFound();

            var contentType = GetContentType(elementPath);
            return File(stream, contentType);
        }

        private static string GetContentType(string path)
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
