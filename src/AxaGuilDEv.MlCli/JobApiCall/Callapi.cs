using System;
using Ml.Cli.InputTask;

namespace Ml.Cli.JobApiCall;

public class Callapi : IInputTask
{
    public Callapi(string type, string id, bool enabled, string fileDirectory, string outputDirectoryJsons,
        string outputDirectoryImages, string outputDirectoryInputs, string outputDirectoryOutputs,
        string frontDefaultStringsMatcher, string downloadStringsMatcher, bool enabledSaveImages,
        bool enabledSaveInputs, bool enabledSaveOutputs, Uri url, bool sortByFileType, int numberIteration,
        int numberParallel,
        int waitTimeMsMsBetweenRequest = 0,
        int numberRetryOnHttp500 = 0,
        int delayOn500 = 5000,
        bool isSaveResultOnError = true,
        int? stopAfterNumberFiles = null,
        int? chunkByNumberPart = null,
        int? chunkIndex = null
    )
    {
        StopAfterNumberFiles = stopAfterNumberFiles;
        Type = type;
        Id = id;
        Enabled = enabled;
        FileDirectory = fileDirectory;
        OutputDirectoryJsons = outputDirectoryJsons;
        OutputDirectoryImages = outputDirectoryImages;
        OutputDirectoryInputs = outputDirectoryInputs;
        OutputDirectoryOutputs = outputDirectoryOutputs;
        FrontDefaultStringsMatcher = frontDefaultStringsMatcher;
        DownloadStringsMatcher = downloadStringsMatcher;
        EnabledSaveImages = enabledSaveImages;
        EnabledSaveInputs = enabledSaveInputs;
        EnabledSaveOutputs = enabledSaveOutputs;
        Url = url;
        SortByFileType = sortByFileType;
        NumberIteration = numberIteration;
        NumberParallel = numberParallel;
        WaitTimeMsBetweenRequest = waitTimeMsMsBetweenRequest;
        NumberRetryOnHttp500 = numberRetryOnHttp500;
        DelayOn500 = delayOn500;
        IsSaveResultOnError = isSaveResultOnError;
        ChunkIndex = chunkIndex;
        ChunkByNumberPart = chunkByNumberPart;
    }

    public string FileDirectory { get; }
    public string OutputDirectoryJsons { get; }
    public string OutputDirectoryImages { get; }
    public string OutputDirectoryInputs { get; }
    public string OutputDirectoryOutputs { get; }
    public string FrontDefaultStringsMatcher { get; }
    public string DownloadStringsMatcher { get; }
    public bool EnabledSaveImages { get; }
    public bool EnabledSaveInputs { get; }
    public bool EnabledSaveOutputs { get; }
    public Uri Url { get; }
    public bool SortByFileType { get; }
    public int NumberIteration { get; }
    public int NumberParallel { get; }
    public int WaitTimeMsBetweenRequest { get; }

    public int NumberRetryOnHttp500 { get; }
    public int DelayOn500 { get; }
    public bool IsSaveResultOnError { get; }
    public int? StopAfterNumberFiles { get; }
    public int? ChunkByNumberPart { get; }
    public int? ChunkIndex { get; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}