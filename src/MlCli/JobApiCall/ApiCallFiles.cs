using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.FileLoader;
using AxaGuilDEv.MlCli.JobApiCall.FileHandler;
using Microsoft.Extensions.Logging;
using MimeTypes;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AxaGuilDEv.MlCli.JobApiCall;

public class ApiCallFiles
{
    private readonly IFileHandler _fileHandler;
    private readonly IFileLoader _fileLoader;

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger _logger;

    public ApiCallFiles(IHttpClientFactory httpClientFactory, IFileLoader fileLoader, IFileHandler fileHandler,
        ILogger logger)
    {
        _httpClientFactory = httpClientFactory;
        _fileLoader = fileLoader;
        _fileHandler = fileHandler;
        _logger = logger;
    }

    private void FindElementsTokens(JToken containerToken, List<FileUrls> urlsList,
        Dictionary<string, JsonsList> jsonsDict)
    {
        switch (containerToken.Type)
        {
            case JTokenType.Object:
            {
                foreach (var child in containerToken.Children<JProperty>())
                {
                    if (child.Name.Contains("url_", StringComparison.Ordinal))
                        urlsList.Add(new FileUrls(child.Name, new Uri(child.Value.ToString())));
                    else if (child.Name.Contains("input_", StringComparison.Ordinal))
                        jsonsDict["input"].Jsons.Add(new FileJsons(child.Name, child.Value.ToString()));
                    else if (child.Name.Contains("output_", StringComparison.Ordinal))
                        jsonsDict["output"].Jsons.Add(new FileJsons(child.Name, child.Value.ToString()));
                    FindElementsTokens(child.Value, urlsList, jsonsDict);
                }

                break;
            }
            case JTokenType.Array:
            {
                foreach (var child in containerToken.Children())
                    FindElementsTokens(child, urlsList, jsonsDict);
                break;
            }
        }
    }

    public async Task ApiCallFilesAsync(string fileName, string json, Callapi inputTask)
    {
        var httpClient = _httpClientFactory.CreateClient(inputTask.Id);

        _logger.LogInformation("Task Id : {InputTaskId} - Processing {FileName}.json", inputTask.Id, fileName);

        var httpResult = JsonConvert.DeserializeObject<Program.HttpResult>(json);

        var correctStatusCode = 200;
        if (httpResult.StatusCode != correctStatusCode)
        {
            _logger.LogError("Task Id: {InputTaskId} - Error: server didn\'t return 200 status code", inputTask.Id);
            return;
        }

        try
        {
            var urlsList = new List<FileUrls>();
            var jsonsDict = new Dictionary<string, JsonsList>
            {
                { "input", new JsonsList() },
                { "output", new JsonsList() }
            };
            var node = JToken.Parse(httpResult.Body);

            FindElementsTokens(node, urlsList, jsonsDict);

            var tempStringsArray = inputTask.DownloadStringsMatcher.Split(",");

            await DownloadFilesAsync(httpClient, fileName, urlsList, jsonsDict, tempStringsArray.Select(regex => regex.Trim()).ToArray(), inputTask);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Task Id : {inputTask.Id} - Parse Json Error", ex);
        }
    }

    private async Task DownloadFilesAsync(HttpClient httpClient, string fileName, List<FileUrls> urlsList,
        IDictionary<string, JsonsList> jsonsDict, string[] stringsArray, Callapi inputTask)
    {
        if (inputTask.EnabledSaveImages)
        {
            _fileLoader.CreateDirectory(inputTask.OutputDirectoryImages);
            foreach (var imageUrl in urlsList.Where(imageUrl => IsStringsArrayMatch(imageUrl.Key, stringsArray.ToArray())))
                await DownloadFilesAsync(httpClient, fileName, imageUrl, inputTask);
        }

        if (inputTask.EnabledSaveInputs)
        {
            _fileLoader.CreateDirectory(inputTask.OutputDirectoryInputs);
            foreach (var input in jsonsDict["input"].Jsons.Where(input => IsStringsArrayMatch(input.Key, stringsArray.ToArray())))
                await DownloadJsonAsync(input, inputTask, true);
        }

        if (inputTask.EnabledSaveOutputs)
        {
            _fileLoader.CreateDirectory(inputTask.OutputDirectoryOutputs);
            foreach (var output in jsonsDict["output"].Jsons)
                if (IsStringsArrayMatch(output.Key, stringsArray.ToArray()))
                    await DownloadJsonAsync(output, inputTask, false);
        }
    }

    private async Task DownloadFilesAsync(HttpClient httpClient, string fileName, FileUrls fileUrl, Callapi inputTask)
    {
        if (fileUrl.Url != null)
        {
            var outputPath = Path.Combine(
                inputTask.OutputDirectoryImages,
                inputTask.SortByFileType ? fileUrl.Key : fileName
            );

            ServicePointManager.FindServicePoint(fileUrl.Url).ConnectionLeaseTimeout = 60000;
            var request = new HttpRequestMessage(HttpMethod.Get, fileUrl.Url);
            await httpClient.GetAsync(fileUrl.Url);
            var httpResponse = httpClient.SendAsync(
                request).Result;
            var contentType = httpResponse.Content.Headers.ContentType;
            var extension = contentType != null ? MimeTypeMap.GetExtension(contentType.MediaType, false) : ".png";
            var filePath = Path.Combine(
                outputPath,
                (inputTask.SortByFileType ? fileName : fileUrl.Key) + extension);
            filePath = _fileHandler.SetFileName(filePath, _fileLoader);
            if (_fileLoader.FileExists(filePath)) return;

            var imageBytes = await httpResponse.Content.ReadAsByteArrayAsync();

            _fileLoader.CreateDirectory(outputPath);

            await _fileLoader.WriteAllBytesOfFileAsync(filePath, imageBytes);
        }
    }

    private async Task DownloadJsonAsync(FileJsons fileJson, Callapi inputTask, bool jsonType)
    {
        var filePath = Path.Combine(
            jsonType ? inputTask.OutputDirectoryInputs : inputTask.OutputDirectoryOutputs,
            fileJson.Key + ".json"
        );
        filePath = _fileHandler.SetFileName(filePath, _fileLoader);
        if (_fileLoader.FileExists(filePath)) return;

        await _fileLoader.WriteAllTextInFileAsync(filePath, fileJson.Json);
    }

    public static bool IsStringsArrayMatch(string input, string[] stringsArray)
    {
        if (stringsArray == null || input == null) return false;
        return stringsArray.Any(element => input.Contains(element));
    }

    private interface IFileObjects
    {
    }

    private class FileUrls : IFileObjects
    {
        public FileUrls(string key, Uri url)
        {
            Key = key;
            Url = url;
        }

        public string Key { get; }
        public Uri Url { get; }
    }

    private class FileJsons : IFileObjects
    {
        public FileJsons(string key, string json)
        {
            Key = key;
            Json = json;
        }

        public string Key { get; }
        public string Json { get; }
    }

    private class JsonsList
    {
        public JsonsList()
        {
            Jsons = new List<FileJsons>();
        }

        public List<FileJsons> Jsons { get; }
    }
}