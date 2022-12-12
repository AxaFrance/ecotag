using System.IO;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.FileLoader;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace AxaGuilDEv.MlCli.JobScript;

public class TaskScript
{
    private readonly IFileLoader _fileLoader;
    private readonly ILogger<TaskScript> _logger;

    public TaskScript(IFileLoader fileLoader, ILogger<TaskScript> logger)
    {
        _fileLoader = fileLoader;
        _logger = logger;
    }

    public async Task FormatCallapiAsync(ScriptTask inputTask)
    {
        _fileLoader.CreateDirectory(inputTask.OutputDirectory);

        foreach (var path in _fileLoader.EnumerateFiles(inputTask.FileDirectory, "*.json"))
        {
            _logger.LogInformation(
                $"Task Id : {inputTask.Id} - Processing {Path.GetFileNameWithoutExtension(path)}.json");

            var json = await _fileLoader.ReadAllTextInFileAsync(path);
            var jsonPath = JsonConvert.DeserializeObject<Program.HttpResult>(json);

            var rawBodyOutput = await ScriptManager.ExecScript(path, inputTask.Script, _fileLoader);

            var outputFileName = Path.Combine(inputTask.OutputDirectory, Path.GetFileName(path));

            var httpResult = new Program.HttpResult
            {
                FileName = jsonPath.FileName,
                FileDirectory = outputFileName,
                ImageDirectory = jsonPath.ImageDirectory,
                FrontDefaultStringsMatcher = jsonPath.FrontDefaultStringsMatcher,
                StatusCode = jsonPath.StatusCode,
                Body = rawBodyOutput,
                Headers = jsonPath.Headers,
                TimeMs = jsonPath.TimeMs,
                Url = jsonPath.Url,
                TicksAt = jsonPath.TicksAt
            };

            var resultContent = JsonConvert.SerializeObject(httpResult, Formatting.Indented);

            await _fileLoader.WriteAllTextInFileAsync(outputFileName, resultContent);
        }
    }
}