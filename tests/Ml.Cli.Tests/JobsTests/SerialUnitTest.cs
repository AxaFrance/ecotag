using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Ml.Cli.InputTask;
using Ml.Cli.JobSerial;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class SerialUnitTest
    {
        [Fact]
        public async Task ShouldExecuteInSequentialOrder()
        {
            var serialTask = new TasksGroup(
                "serial",
                "unique_id",
                true
                );
            serialTask.Tasks = new List<IInputTask>(){serialTask, serialTask, serialTask};
            
            async Task Wait(IInputTask task)
            {
                await Task.Delay(1000);
            }

            var serial = new TaskSerial();

            var sw = Stopwatch.StartNew();
            
            await serial.SerialExecution(serialTask, Wait);

            var result = (sw.ElapsedMilliseconds/1000f) >= 3;
            Assert.True(result);
        }

        [Fact]
        public void ShouldInitialize()
        {
            var serialResult = Initializer.CreateTask("serial", false, "1");
            var expectedSerialResult = new TasksGroup(
                "serial",
                "1",
                false
            );
            Assert.Equal(JsonConvert.SerializeObject(expectedSerialResult), JsonConvert.SerializeObject(serialResult));
        }
    }
}