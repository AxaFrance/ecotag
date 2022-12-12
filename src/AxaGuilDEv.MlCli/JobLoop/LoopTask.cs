using Ml.Cli.InputTask;

namespace Ml.Cli.JobLoop;

public class LoopTask : IInputTask
{
    public LoopTask(string type, string id, bool enabled, string startMessage, string endMessage, int iterations)
    {
        Type = type;
        Id = id;
        Enabled = enabled;
        StartMessage = startMessage;
        EndMessage = endMessage;
        Iterations = iterations;
    }

    public string StartMessage { get; }
    public string EndMessage { get; }
    public int Iterations { get; }

    // ReSharper disable once UnusedAutoPropertyAccessor.Global Task is set while deserializing
    public IInputTask SubTask { get; set; }
    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}