using Ml.Cli.PathManager;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobCopy
{
    public class Initializer
    {
        public static CopyTask CreateTask(JObject jObject, string type, bool tokenEnabled, bool isBaseDirectoryValid, string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            var fromChecked = PropertyHelper.SetProperty(jObject, "from", isBaseDirectoryValid, baseDirectory, taskId,
                pathValidatorHelper);
            var toChecked = PropertyHelper.SetProperty(jObject, "to", isBaseDirectoryValid, baseDirectory, taskId,
                pathValidatorHelper);
            var pattern = (string)jObject.Property("pattern");
            return new CopyTask(
                type,
                taskId,
                tokenEnabled,
                fromChecked,
                pattern,
                toChecked
            );
        }
    }
}