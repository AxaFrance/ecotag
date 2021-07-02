using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.InputTask;

namespace Ml.Cli.JobParallel
{
    public class TaskParallel
    {
        private readonly ILogger<TaskParallel> _logger;

        public TaskParallel(ILogger<TaskParallel> logger)
        {
            _logger = logger;
        }
        
        public void ParallelExecution(IInputTask task, Func<IInputTask, Task> runTaskAsync)
        {
            var parallelOptions = new ParallelOptions {MaxDegreeOfParallelism = Environment.ProcessorCount};
            _logger.LogInformation($"Tasks will be handled with {parallelOptions.MaxDegreeOfParallelism} threads");
            var parallelTask = (TasksGroup) task;
            var promises = new List<Task>();
            
            foreach (var inputSubTask in parallelTask.Tasks)
            {
                promises.Add(runTaskAsync(inputSubTask));
            }
            
            Task.WaitAll(promises.ToArray(), Int32.MaxValue );
        }
    }
}