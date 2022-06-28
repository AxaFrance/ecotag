using System;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Local.Paths;

namespace Ml.Cli.WebApp.Local
{
    [ApiController]
    [Route("api/local/[controller]")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class FilesController : ControllerBase
    {
        private readonly IFileLoader _fileLoader;
        private readonly BasePath _basePath;

        public FilesController(IFileLoader fileLoader, BasePath basePath)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
        }

        [HttpGet("{id}")]
        [ResponseCache(Duration = 1)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ShowFile(string id)
        {
            var elementPath = Encoding.UTF8.GetString(Convert.FromBase64String(id));
            if (!_basePath.IsPathSecure(elementPath))
            {
                return BadRequest("Unreachable file.");
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
