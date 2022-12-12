using AxaGuilDEv.MlCli.InputTask;

namespace AxaGuilDEv.MlCli.JobCompare;

public class CompareTask : IInputTask
{
    public CompareTask(string type, string id, bool enabled, string leftDirectory, string rightDirectory,
        string outputDirectory, string fileName, string onFileNotFound)
    {
        Type = type;
        Id = id;
        Enabled = enabled;
        LeftDirectory = leftDirectory;
        RightDirectory = rightDirectory;
        OutputDirectory = outputDirectory;
        FileName = fileName;
        OnFileNotFound = onFileNotFound;
    }

    public string LeftDirectory { get; }
    public string RightDirectory { get; }
    public string OutputDirectory { get; }
    public string FileName { get; }
    public string OnFileNotFound { get; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}