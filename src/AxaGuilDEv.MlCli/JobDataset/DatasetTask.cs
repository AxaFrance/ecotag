using Ml.Cli.InputTask;

namespace Ml.Cli.JobDataset;

public class DatasetTask : IInputTask
{
    public DatasetTask(string id, string type, bool enabled, string annotationType, string configuration,
        string fileDirectory, string imageDirectory, string outputDirectory, string frontDefaultStringsMatcher,
        string fileName, string script)
    {
        Id = id;
        Type = type;
        Enabled = enabled;
        AnnotationType = annotationType;
        Configuration = configuration;
        FileDirectory = fileDirectory;
        ImageDirectory = imageDirectory;
        OutputDirectory = outputDirectory;
        FrontDefaultStringsMatcher = frontDefaultStringsMatcher;
        FileName = fileName;
        Script = script;
    }

    public string AnnotationType { get; }
    public string Configuration { get; }
    public string FileDirectory { get; }
    public string ImageDirectory { get; }
    public string OutputDirectory { get; }
    public string FrontDefaultStringsMatcher { get; }
    public string FileName { get; }
    public string Script { get; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}