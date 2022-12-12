using System;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.InputTask;

namespace AxaGuilDEv.MlCli.JobSerial;

public class TaskSerial
{
    public async Task SerialExecution(IInputTask task, Func<IInputTask, Task> runTaskAsync)
    {
        var serialTask = (TasksGroup)task;
        foreach (var inputSubTask in serialTask.Tasks) await runTaskAsync(inputSubTask);
    }
}