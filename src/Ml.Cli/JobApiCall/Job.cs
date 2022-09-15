using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Newtonsoft.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Ml.Cli.JobApiCall
{
    public record CallApiSettings
    {
        public string Type { get; set; }
        public List<CallApiSetting> Data { get; set; }
    }

    public record CallApiSetting
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
    }
    
    public class TaskApiCall
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ApiCallFiles _callFiles;
        private readonly IFileLoader _fileLoader;
        private readonly ILogger<TaskApiCall> _logger;

        public TaskApiCall(IHttpClientFactory httpClientFactory, ApiCallFiles callFiles, IFileLoader fileLoader,
            ILogger<TaskApiCall> logger)
        {
            _httpClientFactory = httpClientFactory;
            _callFiles = callFiles;
            _fileLoader = fileLoader;
            _logger = logger;
        }
        
        public static List<List<T>> ChunkBy<T>(List<T> source, int chunkSize) 
        {
            return source
                .Select((x, i) => new { Index = i, Value = x })
                .GroupBy(x => x.Index / (chunkSize == 0 ? 1 : chunkSize))
                .Select(x => x.Select(v => v.Value).ToList())
                .ToList();
        }

        public async Task ApiCallAsync(Callapi inputTask)
        {
            var httpClient = _httpClientFactory.CreateClient(inputTask.Id);
            var outputDirectory =
                inputTask.OutputDirectoryJsons.Replace("{date}", DateTime.Now.ToString("MM_dd_yyyy-hh_mm"));
            _fileLoader.CreateDirectory(outputDirectory);

            var files = _fileLoader.EnumerateFiles(inputTask.FileDirectory, "*").ToList();
            var tasks = new List<Task<string>>();
            var numberFiles = files.Count;
            foreach (var index in Enumerable.Range(0, inputTask.NumberIteration))
            {
                var extension = ".json";
                if (index > 1) extension = $"_{index}{extension}";

                //var listsOfFiles = ChunkBy(files.ToList(), files.Count() / inputTask.NumberParallel);
                
                var indexFile = 0;
                var indexFileFetched = 0;
                var numberKo = 0;
                while (indexFile < numberFiles)
                {
                    while (tasks.Count < inputTask.NumberParallel && indexFile < numberFiles)
                    {
                        var task = PlayDataAsync(httpClient, inputTask, files[indexFile], extension, outputDirectory);
                        indexFile += 1;
                        tasks.Add(task);
                    }
                    await Task.Delay(10);
                    var tasksToRemove = new List<Task<string>>();
                    foreach (var task in tasks)
                    {
                        if (task.IsCompleted)
                        {
                            if (!String.IsNullOrEmpty(task.Result))
                            {
                                indexFileFetched += 1;
                            }
                            if (task.Result == "KO")
                            {
                                numberKo += 1;
                                _logger.LogWarning("number KO: " + numberKo +"/"+ (indexFile+1));
                            }
                            tasksToRemove.Add(task);
                        }
                    }

                    foreach (var task in tasksToRemove)
                    {
                        tasks.Remove(task);
                    }

                    if (inputTask.StopAfterNumberFiles.HasValue)
                    {
                        if (indexFileFetched == inputTask.StopAfterNumberFiles.Value)
                        {
                            break;
                        }
                    }
                    
                }
                
            }
        }

        private async Task<string> PlayDataAsync(HttpClient httpClient, Callapi inputTask, string currentFile, string extension, string outputDirectory)
        {
            if (Path.GetExtension(currentFile) == ".json")
            {
                return String.Empty;
            }

            var fileName = Path.GetFileName(currentFile);
            var jsonFileName = $"{fileName.Replace(".", "_")}{extension}";
            var targetFileName = Path.Combine(outputDirectory, jsonFileName);
            try
            {
                if (_fileLoader.FileExists(targetFileName))
                {
                    _logger.LogWarning($"Task Id: {inputTask.Id} - Already processed file {fileName}");
                    return String.Empty;
                }
                else
                {
                    _logger.LogInformation(
                        $"Task Id: {inputTask.Id} - Processing {fileName} on thread {Thread.CurrentThread.ManagedThreadId}");
                    Program.HttpResult httpResult = null;

                    for (var i = 0; i < inputTask.NumberRetryOnHttp500 + 1; i++)
                    {
                        try
                        {
                            httpResult = await CallHttpAsync(httpClient, inputTask, currentFile, jsonFileName, i);
                            if (httpResult.StatusCode < 500)
                            {
                                break;
                            }
                        }
                        catch (Exception e)
                        {
                            httpResult = new Program.HttpResult
                            {
                                FileName = fileName,
                                FileDirectory = Path.Combine(inputTask.OutputDirectoryJsons, targetFileName),
                                ImageDirectory = inputTask.OutputDirectoryImages,
                                FrontDefaultStringsMatcher = inputTask.FrontDefaultStringsMatcher,
                                StatusCode = 600,
                                Body = $"Task Id: {inputTask.Id} - Error : {e.Message}",
                                Headers = new List<KeyValuePair<string, IEnumerable<string>>>(),
                                TimeMs = 0,
                                Url = inputTask.Url,
                                TicksAt = DateTime.UtcNow.Ticks,
                                TryNumber = i
                            };
                            _logger.LogError($"Task Id: {inputTask.Id} - Error : {e.Message}");
                        }
                        await Task.Delay(inputTask.DelayOn500);
                    }

                    if (httpResult == null)
                            throw new ApplicationException("httpResult is null");

                    if (httpResult.StatusCode < 500 || (inputTask.IsSaveResultOnError && httpResult.StatusCode >= 500))
                    {
                        var json = JsonConvert.SerializeObject(httpResult, Formatting.Indented);
                        await _fileLoader.WriteAllTextInFileAsync(targetFileName,
                            json);
                        if (inputTask.EnabledSaveImages || inputTask.EnabledSaveInputs || inputTask.EnabledSaveOutputs)
                            await _callFiles.ApiCallFilesAsync(fileName, json, inputTask);
                    }

                    return httpResult.StatusCode < 500 ? "OK" : "KO";
                }
            }
            catch (Exception e)
            {
                _logger.LogError($"Task Id: {inputTask.Id} - Error : {e.Message}");
                return "Exception";
            }
        }

        private async Task<Program.HttpResult> CallHttpAsync(HttpClient httpClient, Callapi inputTask, string file, string targetFileName, int tryNumber)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, inputTask.Url);
            
            var requestContent = new MultipartFormDataContent();
            var fileName = Path.GetFileName(file);
            var settingsPath = Path.Combine(Path.GetDirectoryName(file),
                Path.GetFileNameWithoutExtension(file) + ".json");
            if (_fileLoader.FileExists(settingsPath))
            {
                var settingsContent = await _fileLoader.ReadAllTextInFileAsync(settingsPath);
                try
                {
                    var callApiSettings = JsonSerializer.Deserialize<CallApiSettings>(settingsContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (callApiSettings != null && callApiSettings.Data.Count > 0)
                    {
                        foreach (var setting in callApiSettings.Data)
                        {
                            if (setting.Type != "file")
                            {
                                requestContent.Add(new StringContent(setting.Value), setting.Key);
                            }
                            else
                            {
                                var settingFile = Path.Combine(inputTask.FileDirectory, setting.Value);
                                if (_fileLoader.FileExists(settingFile))
                                {
                                    var streamContent = new StreamContent(_fileLoader.OpenRead(settingFile));
                                    requestContent.Add(streamContent, "file", $"filename{Path.GetExtension(settingFile)}");
                                }
                                else
                                {
                                    _logger.LogWarning($"Task Id: {inputTask.Id} - Error : file {settingFile} not found");
                                }
                            }
                        }
                    }
                }
                catch (Exception e)
                {
                    _logger.LogError("An error occured while deserializing options : " + e.Message);
                }
            }
            else
            {
                var streamContent = new StreamContent(_fileLoader.OpenRead(file));
                requestContent.Add(streamContent, "file", $"filename{Path.GetExtension(file)}");
            }
            
            request.Content = requestContent;

            var watch = Stopwatch.StartNew();

            var result = await httpClient.SendAsync(request);
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;
            const int msToSConverter = 1000;
            _logger.LogInformation($"Task Id: {inputTask.Id} - {file} time:{elapsedMs / msToSConverter} ms");

            var body = await result.Content.ReadAsStringAsync();
            var headersList = request.Headers.ToList();
            var httpResult = new Program.HttpResult
            {
                FileName = fileName,
                FileDirectory = Path.Combine(inputTask.OutputDirectoryJsons, targetFileName),
                ImageDirectory = inputTask.OutputDirectoryImages,
                FrontDefaultStringsMatcher = inputTask.FrontDefaultStringsMatcher,
                StatusCode = (int) result.StatusCode,
                Body = body,
                Headers = headersList.Where(w => w.Key != "Authorization").ToList(),
                TimeMs = elapsedMs,
                Url = inputTask.Url,
                TicksAt = DateTime.UtcNow.Ticks,
                TryNumber = tryNumber
            };
            return httpResult;
        }
    }
}