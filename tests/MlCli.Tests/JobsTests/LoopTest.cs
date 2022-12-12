using System;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.InputTask;
using AxaGuilDEv.MlCli.JobApiCall;
using AxaGuilDEv.MlCli.JobLoop;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;
using Initializer = AxaGuilDEv.MlCli.JobLoop.Initializer;

namespace AxaGuilDEv.MlCli.Tests.JobsTests;

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

    [Fact]
    public void ShouldInitialize()
    {
        var jsonContent =
            "{\"type\": \"loop\",\"id\": \"1\",\"enabled\": false,\"startMessage\": \"Starting loop procedure...\",\"endMessage\": \"End of loop procedure\",\"iterations\": 3,\"subTask\": {\"type\": \"callapi\",\"id\": \"child_task\",\"enabled\": true,\"fileDirectory\": \"licenses/documents\",\"outputDirectoryJsons\": \"licenses/output\",\"url\" :\"https://localhost:6001/licenses/upload\"}}";
        var jObject = JObject.Parse(jsonContent);

        var loopResult = Initializer.CreateTask(jObject, "loop", false, "1");
        var expectedLoopResult = new LoopTask(
            "loop",
            "1",
            false,
            "Starting loop procedure...",
            "End of loop procedure",
            3
        );
        Assert.Equal(JsonConvert.SerializeObject(expectedLoopResult), JsonConvert.SerializeObject(loopResult));
    }
}