using Ml.Cli.InputTask;

namespace Ml.Cli.JobSerial
{
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
}