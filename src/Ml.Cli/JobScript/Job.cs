using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.ClearScript.V8;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobScript
{
    public class TaskScript
    {
        private readonly IFileLoader _fileLoader;
        private readonly ILogger<TaskScript> _logger;

        public TaskScript(IFileLoader fileLoader, ILogger<TaskScript> logger)
        {
            _fileLoader = fileLoader;
            _logger = logger;
        }

        // ReSharper disable once MemberCanBePrivate.Global : Class used by the V8ScriptEngine, must be public
        public static class EngineConsole
        {
            // ReSharper disable once InconsistentNaming : JavaScript naming convention
            // ReSharper disable once UnusedMember.Global
            public static void log(string value) => Console.WriteLine(value);
        }
        
        private async Task<string> ExecScript(string path, ScriptTask inputTask)
        {
            var engine = new V8ScriptEngine();
            engine.AddHostType("console", typeof(EngineConsole));
            var json = JToken.Parse(await _fileLoader.LoadAsync(path));
            var jsonResult = (JObject) json;
            var body = (string) jsonResult.Property("Body");
            engine.Script.rawBodyInput = body;
            engine.Execute(inputTask.Script);
            return (string) engine.Script.rawBodyOutput;
        }
        
        public async Task FormatCallapiAsync(ScriptTask inputTask)
        {
            _fileLoader.CreateDirectory(inputTask.OutputDirectory);

            foreach (var path in _fileLoader.EnumerateFiles(inputTask.FileDirectory, "*.json"))
            {
                _logger.LogInformation($"Task Id : {inputTask.Id} - Processing {Path.GetFileNameWithoutExtension(path)}.json");

                var json = await _fileLoader.ReadAllTextInFileAsync(path);
                var jsonPath = JsonConvert.DeserializeObject<Program.HttpResult>(json);
                
                var rawBodyOutput = await ExecScript(path, inputTask);
                
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
}