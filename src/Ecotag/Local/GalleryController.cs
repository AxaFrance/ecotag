using System;
using System.Collections.Generic;
using System.Text;
using AxaGuilDEv.Ecotag.Local.Paths;
using AxaGuilDEv.MlCli.FileLoader;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AxaGuilDEv.Ecotag.Local;

[ApiController]
[Route("api/local/gallery")]
[ApiExplorerSettings(IgnoreApi = true)]
public class GalleryController : ControllerBase
{
    private readonly BasePath _basePath;
    private readonly IFileLoader _fileLoader;

    public GalleryController(IFileLoader fileLoader, BasePath basePath)
    {
        _fileLoader = fileLoader;
        _basePath = basePath;
    }

    [HttpGet("{directoryPathBase64}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetFilesFromDirectory(string directoryPathBase64)
    {
        var directoryPath = Encoding.UTF8.GetString(Convert.FromBase64String(directoryPathBase64));
        var files = FilesHandler.GetFilesFromDirectoryPath(directoryPath, _basePath, _fileLoader);
        if (files == null) return BadRequest("Invalid path");

        return Ok(files);
    }
}