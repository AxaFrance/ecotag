using System;
using System.Threading.Tasks;
using Ml.Cli.InputTask;

namespace Ml.Cli.JobSerial
{
    public class TaskSerial
    {
        public async Task SerialExecution(IInputTask task, Func<IInputTask, Task> runTaskAsync)
        {
            var serialTask = (TasksGroup) task;
            foreach (var inputSubTask in serialTask.Tasks)
            {
                await runTaskAsync(inputSubTask);
            }
        }
    }
}