using System;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.InputTask;
using Microsoft.Extensions.Logging;

namespace AxaGuilDEv.MlCli.JobLoop;

public class TaskLoop
{
    private readonly ILogger<Program> _logger;

    public TaskLoop(ILogger<Program> logger)
    {
        _logger = logger;
    }

    public async Task LoopExecution(IInputTask task, Func<IInputTask, Task> runTaskAsync)
    {
        var loopTask = (LoopTask)task;
        if (loopTask.Iterations == 0)
        {
            var count = 0;
            while (true)
            {
                _logger.LogInformation($"{loopTask.StartMessage} (iteration number: {count})");
                await runTaskAsync(loopTask.SubTask);
                _logger.LogInformation($"{loopTask.EndMessage} (iteration number: {count})");
                count++;
            }
        }

        for (var i = 0; i < loopTask.Iterations; i++)
        {
            _logger.LogInformation($"{loopTask.StartMessage} (iteration number: {i})");
            await runTaskAsync(loopTask.SubTask);
            _logger.LogInformation($"{loopTask.EndMessage} (iteration number: {i})");
        }
    }
}