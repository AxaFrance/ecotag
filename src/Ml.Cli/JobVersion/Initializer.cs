using Ml.Cli.Helper;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobVersion
{
    public class Initializer
    {
        public static VersionTask CreateTask(JObject jObject, string type, bool tokenEnabled, bool isBaseDirectoryValid, string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            long? timeout = null;
            if (jObject.Property("timeout") != null)
            {
                timeout = (long?) jObject.Property("timeout");
            }

            return new VersionTask(
                type,
                taskId,
                tokenEnabled,
                (string) jObject.Property("url"),
                timeout,
                PropertyHelper.SetProperty(jObject, "urlLogDirectory", isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper),
                (string) jObject.Property("logFileName")
            );
        }
    }
}