using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Paths;

namespace Ml.Cli.WebApp.Local
{
    [ApiController]
    [Route("api/local/gallery")]
    public class GalleryController : ControllerBase
    {
        private readonly IFileLoader _fileLoader;
        private readonly BasePath _basePath;

        public GalleryController(IFileLoader fileLoader, BasePath basePath)
        {
            _fileLoader = fileLoader;
            _basePath = basePath;
        }
        
        [HttpGet("{directoryPath}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetFilesFromDirectory(string directoryPath)
        {
            var files = FilesHandler.GetFilesFromDirectoryPath(directoryPath, _basePath, _fileLoader);
            if (files == null)
            {
                return BadRequest("Invalid path");
            }

            return Ok(files);
        }
    }
}