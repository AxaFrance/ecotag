using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Ml.Cli.JobVersion;

public class Version
{
    private static readonly object LockObject = new();
    private readonly HttpClient _client;
    private readonly IFileLoader _fileLoader;
    private readonly ILogger<Version> _logger;

    public Version(IHttpClientFactory client, IFileLoader fileLoader, ILogger<Version> logger)
    {
        _client = client.CreateClient("Default");
        _client.Timeout = TimeSpan.FromSeconds(30);
        _fileLoader = fileLoader;
        _logger = logger;
    }

    private async Task<string> GetVersion(string url, string taskId)
    {
        try
        {
            return await _client.GetStringAsync(url);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, $"Task Id: {taskId} -  Server in {url}");
            return "";
        }
    }

    private async Task UpdateUrl(VersionTask inputTask, string version)
    {
        var fileName = Path.Combine(inputTask.UrlLogDirectory, inputTask.LogFileName);

        var urlFileObject = new UrlFileObject(inputTask.Url, version);

        var contractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        };

        lock (LockObject)
        {
            _fileLoader.CreateDirectory(inputTask.UrlLogDirectory);

            string result;
            if (_fileLoader.FileExists(fileName))
            {
                var isInFile = false;
                var content = _fileLoader.Load(fileName);
                var arrayUrlFileObjects = JsonConvert.DeserializeObject<IList<UrlFileObject>>(content);
                foreach (var fileObject in arrayUrlFileObjects)
                    if (fileObject.Url == inputTask.Url)
                    {
                        fileObject.Version = version;
                        isInFile = true;
                        break;
                    }

                if (!isInFile)
                {
                    if (new FileInfo(fileName).Length == 0)
                        arrayUrlFileObjects = new[] { urlFileObject };
                    else
                        arrayUrlFileObjects.Add(urlFileObject);
                }

                result = JsonConvert.SerializeObject(arrayUrlFileObjects, new JsonSerializerSettings
                {
                    ContractResolver = contractResolver,
                    Formatting = Formatting.Indented
                });
            }
            else
            {
                var array = new[] { urlFileObject };
                result = JsonConvert.SerializeObject(array, new JsonSerializerSettings
                {
                    ContractResolver = contractResolver,
                    Formatting = Formatting.Indented
                });
            }

            var waitWritePromise = _fileLoader.WriteAllTextInFileAsync(fileName, result);
            waitWritePromise.Wait();
        }
    }

    public async Task WaitVersionChange(VersionTask inputTask)
    {
        var version = await GetVersion(inputTask.Url, inputTask.Id);
        var currentVersion = version;

        _logger.LogInformation(
            $"Task Id: {inputTask.Id} -  Waiting for new version (last found is {version}; url: {inputTask.Url})");

        await UpdateUrl(inputTask, version);

        var stopWatch = Stopwatch.StartNew();

        while (currentVersion.Equals(version))
        {
            if (inputTask.Timeout.HasValue && stopWatch.ElapsedMilliseconds > inputTask.Timeout.Value)
            {
                _logger.LogInformation($"Task Id: {inputTask.Id} - Timeout reached: waited for " +
                                       inputTask.Timeout / 1000 + " seconds");
                return;
            }

            _logger.LogInformation(
                $"Task Id: {inputTask.Id} -  Waiting for new version (last found is {version}; url: {inputTask.Url})");

            await Task.Delay(30000);
            currentVersion = await GetVersion(inputTask.Url, inputTask.Id);
        }

        _logger.LogInformation("New version acquired: " + currentVersion + "; url: " + inputTask.Url);

        await UpdateUrl(inputTask, currentVersion);
    }

    private class UrlFileObject
    {
        public UrlFileObject(string url, string version)
        {
            Url = url;
            Version = version;
        }

        public string Url { get; }
        public string Version { get; set; }
    }
}