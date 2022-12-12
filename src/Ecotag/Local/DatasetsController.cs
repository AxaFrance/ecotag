using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Local.Paths;
using AxaGuilDEv.MlCli.FileLoader;
using AxaGuilDEv.MlCli.JobApiCall;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AxaGuilDEv.Ecotag.Local;

[ApiController]
[Route("api/local/[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class DatasetsController : ControllerBase
{
    private readonly BasePath _basePath;
    private readonly DatasetsPaths _datasetsPaths;
    private readonly IFileLoader _fileLoader;

    public DatasetsController(IFileLoader fileLoader, BasePath basePath, DatasetsPaths datasetsPaths)
    {
        _fileLoader = fileLoader;
        _basePath = basePath;
        _datasetsPaths = datasetsPaths;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetFiles()
    {
        if (_datasetsPaths.Paths == string.Empty)
            return BadRequest("Dataset files repositories paths are unspecified.");

        return Ok(FilesHandler.GetFilesFromPaths(_datasetsPaths.Paths, _basePath, _fileLoader));
    }

    [HttpGet("{id}")]
    [ResponseCache(Duration = 1)]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<string>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetFilesFromFileName(string id)
    {
        var tempUrlContent = Encoding.UTF8.GetString(Convert.FromBase64String(id));
        var urlContentArray =
            tempUrlContent.Split(new[] { "&stringsMatcher=", "&directory=" }, StringSplitOptions.None);

        if (urlContentArray[0] == string.Empty || urlContentArray[2] == string.Empty) return BadRequest();

        if (!_basePath.IsPathSecure(urlContentArray[2])) return BadRequest();

        var fileName = urlContentArray[0].Replace("fileName=", string.Empty);

        var tempStringsMatcherArray = urlContentArray[1].Split(Separators.CommaSeparator);
        var stringsArray = new List<string>();
        foreach (var regex in tempStringsMatcherArray) stringsArray.Add(regex.Trim());

        var directory = urlContentArray[2];
        var filesList = new List<string>();
        var directories = _fileLoader.EnumerateDirectories(directory);
        if (directories == null)
            return BadRequest();

        foreach (var currentDirectory in directories)
        {
            var files = _fileLoader.EnumerateFiles(currentDirectory);
            if (files == null)
                continue;

            foreach (var file in files)
            {
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                var currentFile = Path.GetFileNameWithoutExtension(file);
                var currentFileIndex = currentFile.LastIndexOf(Separators.DotSeparator, StringComparison.Ordinal);
                var currentFileFormatted = currentFile.Remove(currentFileIndex, 1)
                    .Insert(currentFileIndex, Separators.UnderscoreSeparator);

                if (currentFileFormatted.Equals(fileNameWithoutExtension) &&
                    ApiCallFiles.IsStringsArrayMatch(file, stringsArray.ToArray()))
                    filesList.Add(file);
            }
        }

        return Ok(filesList);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SaveJson([FromBody] MlCli.Program.HttpResult data)
    {
        if (data == null || !_basePath.IsPathSecure(data.FileDirectory)) return BadRequest();

        try
        {
            data = ReformatHttpResult(data);
            await _fileLoader.WriteAllTextInFileAsync(data.FileDirectory,
                JsonConvert.SerializeObject(data, Formatting.Indented));
            return Ok();
        }
        catch
        {
            return BadRequest();
        }
    }

    private static MlCli.Program.HttpResult ReformatHttpResult(MlCli.Program.HttpResult httpResult)
    {
        dynamic contentBody = JsonConvert.DeserializeObject(httpResult.Body);
        if (contentBody != null) httpResult.Body = JsonConvert.SerializeObject(contentBody);

        return httpResult;
    }
}