using AxaGuilDEv.MlCli.InputTask;
using Newtonsoft.Json.Linq;

namespace AxaGuilDEv.MlCli.JobLoop;

public class Initializer
{
    public static IInputTask CreateTask(JObject jObject, string type, bool tokenEnabled, string taskId)
    {
        var nbIterations = (int)(jObject["iterations"] ?? 0);

        return new LoopTask(
            type,
            taskId,
            tokenEnabled,
            (string)jObject.Property("startMessage"),
            (string)jObject.Property("endMessage"),
            nbIterations
        );
    }
}