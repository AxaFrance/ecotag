using Ml.Cli.InputTask;

namespace Ml.Cli.JobVersion;

public class VersionTask : IInputTask
{
    public VersionTask(string type, string id, bool enabled, string url, long? timeout, string urlLogDirectory,
        string logFileName)
    {
        Type = type;
        Id = id;
        Enabled = enabled;
        Url = url;
        Timeout = timeout;
        UrlLogDirectory = urlLogDirectory;
        LogFileName = logFileName;
    }

    public string Url { get; }
    public long? Timeout { get; }
    public string UrlLogDirectory { get; }
    public string LogFileName { get; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}