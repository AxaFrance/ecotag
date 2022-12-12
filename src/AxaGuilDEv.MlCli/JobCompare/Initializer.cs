using Ml.Cli.PathManager;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobCompare;

public class Initializer
{
    public static CompareTask CreateTask(JObject jObject, string type, bool tokenEnabled, bool isBaseDirectoryValid,
        string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
    {
        return new CompareTask(
            type,
            taskId,
            tokenEnabled,
            PropertyHelper.SetProperty(jObject, "leftDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                pathValidatorHelper),
            PropertyHelper.SetProperty(jObject, "rightDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                pathValidatorHelper),
            PropertyHelper.SetProperty(jObject, "outputDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                pathValidatorHelper),
            (string)jObject.Property("fileName"),
            jObject.ContainsKey("onFileNotFound") ? (string)jObject.Property("onFileNotFound") : "exception"
        );
    }
}