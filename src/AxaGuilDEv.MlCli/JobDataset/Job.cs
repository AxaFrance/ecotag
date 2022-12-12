using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobScript;
using Newtonsoft.Json;

namespace Ml.Cli.JobDataset;

public class TaskDataset
{
    private readonly IFileLoader _fileLoader;
    private readonly ILogger _logger;

    public TaskDataset(IFileLoader fileLoader, ILogger logger)
    {
        _fileLoader = fileLoader;
        _logger = logger;
    }

    public async Task GenerateDatasetAsync(DatasetTask inputTask)
    {
        var datasetResults = new List<DatasetResult>();
        foreach (var filePath in _fileLoader.EnumerateFiles(inputTask.FileDirectory, "*.json"))
        {
            var fileName = Path.GetFileName(filePath);
            _logger.LogInformation($"Task Id: {inputTask.Id} - Generating dataset info for {fileName}");
            var annotations = inputTask.Script != string.Empty
                ? await ScriptManager.ExecScript(filePath, inputTask.Script, _fileLoader)
                : string.Empty;
            var datasetResult = new DatasetResult(fileName, inputTask.FileDirectory, inputTask.ImageDirectory,
                inputTask.FrontDefaultStringsMatcher,
                annotations);
            datasetResults.Add(datasetResult);
        }

        var datasetContent = new DatasetFileResult(Path.Combine(inputTask.OutputDirectory, inputTask.FileName),
            inputTask.AnnotationType, inputTask.Configuration, datasetResults);
        _fileLoader.CreateDirectory(inputTask.OutputDirectory);
        await _fileLoader.WriteAllTextInFileAsync(
            datasetContent.DatasetLocation,
            JsonConvert.SerializeObject(datasetContent,
                Formatting.Indented));
    }
}