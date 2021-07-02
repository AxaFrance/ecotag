using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.InputTask;
using Ml.Cli.JobApiCall;
using Ml.Cli.JobLoop;
using Moq;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class LoopTest
    {
        [Fact]
        public async Task ShouldExecuteTask()
        {
            var uri = new Uri("https://url");
            
            var loopTask = new LoopTask(
                "loop",
                "unique_id",
                true,
                "Début de la procédure",
                "Fin de la boucle",
                3
            )
            {
                SubTask = new Callapi(
                    "callapi", 
                    "unique_id",
                    true, 
                    @"C:\ml\raw_ap\input",
                    @"C:\ml\raw_ap\outputJsons",
                    @"C:\ml\raw_ap\outputImages",
                    @"C:\ml\raw_ap\outputDirInputs",
                    @"C:\ml\raw_ap\outputDirInputs",
                    "",
                    "",
                    false,
                    false,
                    false,
                    uri,
                    false,
                    1, 1)
            };

            var logger = Mock.Of<ILogger<Program>>();
            
            var count = 0;
            
            var loop = new TaskLoop(logger);

            async Task Wait(IInputTask task)
            {
                await Task.Delay(1);
                count += 1;
            }

            await loop.LoopExecution(loopTask, Wait);

            Assert.Equal(3, count);
        }
    }
}