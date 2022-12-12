using Ml.Cli.InputTask;

namespace Ml.Cli.JobScript;

public class ScriptTask : IInputTask
{
    public ScriptTask(string type, string id, bool enabled, string fileDirectory, string outputDirectory, string script)
    {
        Type = type;
        Id = id;
        Enabled = enabled;
        FileDirectory = fileDirectory;
        OutputDirectory = outputDirectory;
        Script = script;
    }

    public string FileDirectory { get; }
    public string OutputDirectory { get; }
    public string Script { get; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}