using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobDataset
{
    public class TaskDataset
    {
        private readonly IFileLoader _fileLoader;
        private readonly ILogger _logger;

        public TaskDataset(IFileLoader fileLoader, ILogger logger)
        {
            _fileLoader = fileLoader;
            _logger = logger;
        }

        private class BoundingBox
        {
            public string Content { get; }

            public BoundingBox(string content)
            {
                Content = content;
            }
        }

        private void FindBoundingBoxes(JToken containerToken, List<BoundingBox> boundingBoxes)
        {
            if (containerToken.Type == JTokenType.Object)
            {
                foreach (var property in containerToken.Children<JProperty>())
                {
                    if (property.Name.Contains("output_", StringComparison.Ordinal))
                    {
                        boundingBoxes.Add(new BoundingBox(property.Value.ToString()));
                    }
                    FindBoundingBoxes(property.Value, boundingBoxes);
                }
            }
            else if (containerToken.Type == JTokenType.Array)
            {
                foreach (var child in containerToken.Children())
                {
                    FindBoundingBoxes(child, boundingBoxes);
                }
            }
        }

        public async Task GenerateDatasetAsync(DatasetTask inputTask)
        {
            var datasetResults = new List<DatasetResult>();
            foreach (var filePath in _fileLoader.EnumerateFiles(inputTask.FileDirectory, "*.json"))
            {
                var fileName = Path.GetFileName(filePath);
                _logger.LogInformation($"Task Id: {inputTask.Id} - Generating dataset info for {fileName}");
                var fileContent = await _fileLoader.ReadAllTextInFileAsync(filePath);
                var httpResult = JsonConvert.DeserializeObject<Program.HttpResult>(fileContent);
                var node = JToken.Parse(httpResult.Body);
                var boundingBoxesList = new List<BoundingBox>();
                FindBoundingBoxes(node, boundingBoxesList);
                var datasetResult = new DatasetResult(fileName, inputTask.FileDirectory, inputTask.ImageDirectory, JsonConvert.SerializeObject(boundingBoxesList));
                datasetResults.Add(datasetResult);
            }
            var datasetContent = new DatasetFileResult(Path.Combine(inputTask.OutputDirectory, inputTask.FileName), inputTask.AnnotationType, inputTask.Configuration, datasetResults);
            _fileLoader.CreateDirectory(inputTask.OutputDirectory);
            await _fileLoader.WriteAllTextInFileAsync(
                datasetContent.DatasetLocation,
                JsonConvert.SerializeObject(datasetContent,
                    Formatting.Indented));
        }
    }
}
