using Ml.Cli.Helper;
using Ml.Cli.InputTask;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobScript
{
    public class Initializer
    {
        public static ScriptTask CreateTask(JObject jObject, string type, bool tokenEnabled, bool isBaseDirectoryValid, string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            return new ScriptTask(
                type,
                taskId,
                tokenEnabled,
                PropertyHelper.SetProperty(jObject, "fileDirectory", isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper),
                PropertyHelper.SetProperty(jObject, "outputDirectory", isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper),
                (string) jObject.Property("script")
            );
        }
    }
}