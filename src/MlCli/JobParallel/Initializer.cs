using AxaGuilDEv.MlCli.InputTask;

namespace AxaGuilDEv.MlCli.JobParallel;

public class Initializer
{
    public static IInputTask CreateTask(string type, bool tokenEnabled, string taskId)
    {
        return new TasksGroup(
            type,
            taskId,
            tokenEnabled
        );
    }
}