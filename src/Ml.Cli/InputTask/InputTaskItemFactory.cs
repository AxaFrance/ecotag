using System;
using System.Collections.Generic;
using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ml.Cli.Helper;
using Ml.Cli.JobCompare;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.InputTask
{
    public class InputTaskItemFactory : Newtonsoft.Json.Converters.CustomCreationConverter<IInputTask>
    {

        private readonly string _baseDirectory;
        private readonly ILogger _logger;
        private readonly IPathValidatorHelper _pathValidatorHelper;
        private readonly IServiceCollection _services;
        private int _countTasks;
        private string _taskId;

        public InputTaskItemFactory(string baseDirectory, ILogger logger, IServiceCollection services, IPathValidatorHelper pathValidatorHelper)
        {
            _baseDirectory = baseDirectory;
            _logger = logger;
            _pathValidatorHelper = pathValidatorHelper;
            _services = services;
        }

        public override IInputTask Create(Type objectType)
        {
            //objectType : Ml.Cli.IInputTask
            throw new NotImplementedException();
        }

        private IInputTask Create(JObject jObject)
        {
            _countTasks++;
            var tokenId = jObject["id"];
            _taskId = tokenId == null ? "task" + _countTasks : (string) jObject.Property("id");

            if ((string) jObject.Property("fileDirectory") == "" || (string) jObject.Property("outputDirectory") == "")
            {
                throw new Exception($"Task Id: {_taskId} - Directory of task is unspecified");
            }
            
            CheckDirectoriesVariables(jObject);
            
            var isBaseDirectoryValid = _pathValidatorHelper.IsPathValid(_baseDirectory, _taskId);
            if (!isBaseDirectoryValid)
            {
                _logger.LogWarning("Specified base directory is invalid. Execution will be performed exclusively with paths defined in tasks.json");
            }
            
            var type = (string) jObject.Property("type");
            var tokenEnabled = !jObject.ContainsKey("enabled") || (bool) jObject.Property("enabled");
            
            switch (type)
            {
                case "compare":
                    return Initializer.CreateTask(jObject, type, tokenEnabled, isBaseDirectoryValid, _baseDirectory, _taskId, _pathValidatorHelper);
                case "parallel":
                    return JobParallel.Initializer.CreateTask(type, tokenEnabled, _taskId);
                case "serial":
                    return JobSerial.Initializer.CreateTask(type, tokenEnabled, _taskId);
                case "loop":
                    return JobLoop.Initializer.CreateTask(jObject, type, tokenEnabled, _taskId);
                case "wait_version_change":
                    return JobVersion.Initializer.CreateTask(jObject, type, tokenEnabled, isBaseDirectoryValid, _baseDirectory, _taskId, _pathValidatorHelper);
                case "callapi":
                    return JobApiCall.Initializer.CreateTask(jObject, type, tokenEnabled, isBaseDirectoryValid, _baseDirectory, _taskId, _services, _pathValidatorHelper);
                case "script":
                    return JobScript.Initializer.CreateTask(jObject, type, tokenEnabled, isBaseDirectoryValid, _baseDirectory, _taskId, _pathValidatorHelper);
                case "dataset":
                    return JobDataset.Initializer.CreateTask(jObject, type, tokenEnabled, isBaseDirectoryValid, _baseDirectory, _taskId, _pathValidatorHelper);
            }
            throw new ApplicationException($"The task type {type} is not implemented !");
        }

        private static void CheckDirectoriesVariables(JObject jObject)
        {
            var itemsDictionary = new Dictionary<string, string>
            {
                {"fileDirectory", (string) jObject.Property("fileDirectory", StringComparison.Ordinal)},
                {"leftDirectory", (string) jObject.Property("leftDirectory", StringComparison.Ordinal)},
                {"rightDirectory", (string) jObject.Property("rightDirectory", StringComparison.Ordinal)},
                {"urlLogDirectory", (string) jObject.Property("urlLogDirectory", StringComparison.Ordinal)},
                {"imageDirectory", (string) jObject.Property("imageDirectory", StringComparison.Ordinal)},
                {"fileName", (string) jObject.Property("fileName", StringComparison.Ordinal)},
                {"outputDirectoryJsons", (string) jObject.Property("outputDirectoryJsons", StringComparison.Ordinal)},
                {"outputDirectoryImages", (string) jObject.Property("outputDirectoryImages", StringComparison.Ordinal)},
                {"outputDirectoryInputs", (string) jObject.Property("outputDirectoryInputs", StringComparison.Ordinal)},
                {"outputDirectoryOutputs", (string) jObject.Property("outputDirectoryOutputs", StringComparison.Ordinal)},
                {"outputDirectory", (string) jObject.Property("outputDirectory", StringComparison.Ordinal)}
            };
            
            var outputDictionary = new Dictionary<string, string>();

            foreach (var element in itemsDictionary)
            {
                if (element.Value != null && element.Value.Contains("{start-date}", StringComparison.Ordinal))
                {
                    var timeStamp = GetTimeStamp();
                    outputDictionary[element.Key] = element.Value.Replace("{start-date}", timeStamp, StringComparison.Ordinal);
                }
            }

            foreach (var result in outputDictionary)
            {
                // ReSharper disable once PossibleNullReferenceException
                jObject.Property(result.Key).Value = outputDictionary[result.Key];
            }
        }

        private static string GetTimeStamp()
        {
            var tempStr = DateTime.Now.ToLocalTime().ToString("HHmm-dd-MM-yyyy", CultureInfo.InvariantCulture);
            return tempStr.Insert(2, "h");
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var jObject = JObject.Load(reader);
            var target = Create(jObject);
            
            serializer.Populate(jObject.CreateReader(), target);
            return target;
        }
    }
}
