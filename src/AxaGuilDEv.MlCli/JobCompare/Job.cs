using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Newtonsoft.Json;

namespace Ml.Cli.JobCompare;

public class TaskCompare
{
    private readonly IFileLoader _fileLoader;
    private readonly ILogger _logger;

    public TaskCompare(IFileLoader fileLoader, ILogger logger)
    {
        _fileLoader = fileLoader;
        _logger = logger;
    }

    public async Task CompareAsync(CompareTask inputTask)
    {
        IList<CompareResult> compareResults = new List<CompareResult>();
        foreach (var fileLeftPath in _fileLoader.EnumerateFiles(inputTask.LeftDirectory, "*.json"))
        {
            var fileName = Path.GetFileName(fileLeftPath);
            var filePath = fileLeftPath.Contains(".." + Path.DirectorySeparatorChar)
                ? fileLeftPath
                : Path.Combine(inputTask.LeftDirectory, fileLeftPath);
            _logger.LogInformation($"Task Id: {inputTask.Id} - Compare {fileName}");
            var jsonLeft = await _fileLoader.ReadAllTextInFileAsync(filePath);
            Program.HttpResult left;
            try
            {
                left = JsonConvert.DeserializeObject<Program.HttpResult>(jsonLeft);
            }
            catch (JsonException)
            {
                left = CreateHttpResult(jsonLeft, fileName, filePath);
            }

            var fileRightPath = Path.Combine(inputTask.RightDirectory, fileName);
            if (!_fileLoader.FileExists(fileRightPath))
            {
                if (inputTask.OnFileNotFound == "warning")
                {
                    _logger.LogWarning(
                        $"Task Id: {inputTask.Id} - File not found for comparison in right path: {fileRightPath}");
                    continue;
                }

                throw new FileNotFoundException(fileRightPath);
            }

            var jsonRight = await _fileLoader.ReadAllTextInFileAsync(fileRightPath);
            Program.HttpResult right;
            try
            {
                right = JsonConvert.DeserializeObject<Program.HttpResult>(jsonRight);
            }
            catch (JsonException)
            {
                right = CreateHttpResult(jsonRight, fileName, fileRightPath);
            }

            compareResults.Add(new CompareResult
            {
                FileName = fileName,
                Left = left,
                Right = right
            });
        }

        var fileContent = new FileResult(Path.Combine(inputTask.OutputDirectory, inputTask.FileName), compareResults);

        _fileLoader.CreateDirectory(inputTask.OutputDirectory);

        await _fileLoader.WriteAllTextInFileAsync(
            fileContent.CompareLocation,
            JsonConvert.SerializeObject(fileContent,
                Formatting.Indented));
    }

    private Program.HttpResult CreateHttpResult(string body, string fileName, string fileDirectory)
    {
        return new Program.HttpResult
        {
            FileName = fileName,
            FileDirectory = fileDirectory,
            ImageDirectory = "",
            FrontDefaultStringsMatcher = "",
            StatusCode = 200,
            Body = body,
            Headers = new List<KeyValuePair<string, IEnumerable<string>>>(),
            TimeMs = 0,
            Url = null,
            TicksAt = 0
        };
    }
}