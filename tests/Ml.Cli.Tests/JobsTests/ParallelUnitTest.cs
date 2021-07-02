using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.InputTask;
using Ml.Cli.JobParallel;
using Moq;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class ParallelUnitTest
    {
        [Fact]
        public void ShouldExecuteInParallel()
        {
            var parallelTask = new TasksGroup(
                "parallel",
                "unique_id",
                true
            );
            parallelTask.Tasks = new List<IInputTask>(){parallelTask, parallelTask, parallelTask};

            var logger = Mock.Of<ILogger<TaskParallel>>();
            
            async Task Wait(IInputTask task)
            {
                await Task.Delay(1000);
            }

            var parallel = new TaskParallel(logger);

            var sw = Stopwatch.StartNew();
            
            parallel.ParallelExecution(parallelTask, Wait);

            var result = (sw.ElapsedMilliseconds/1000f) < 3;
            Assert.True(result);
        }
    }
}