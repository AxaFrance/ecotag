using Ml.Cli.InputTask;

namespace Ml.Cli.JobCopy;

public class CopyTask : IInputTask
{
    public CopyTask(string type, string id, bool enabled, string from, string pattern, string to)
    {
        Pattern = pattern;
        Type = type;
        Id = id;
        Enabled = enabled;
        From = from;
        To = to;
    }

    public string From { get; }
    public string Pattern { get; }
    public string To { get; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}