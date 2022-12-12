using System.Collections.Generic;

namespace Ml.Cli.InputTask;

public class TasksGroup : IInputTask
{
    public TasksGroup(string type, string id, bool enabled)
    {
        Type = type;
        Id = id;
        Enabled = enabled;
    }

    // ReSharper disable once UnusedAutoPropertyAccessor.Global Tasks list is set while deserializing
    // ReSharper disable once CollectionNeverUpdated.Global The collection is used as read only
    public List<IInputTask> Tasks { get; set; }

    public string Id { get; }
    public string Type { get; }
    public bool Enabled { get; }
}