using Ml.Cli.Helper;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobDataset
{
    public class Initializer
    {
        public static DatasetTask CreateTask(JObject jObject, string type, bool enabled, bool isBaseDirectoryValid, string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            return new DatasetTask(
                taskId,
                type,
                enabled,
                (string) jObject.Property("annotationType"),
                (string) jObject.Property("configuration"),
                PropertyHelper.SetProperty(jObject, "fileDirectory", isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper),
                PropertyHelper.SetProperty(jObject, "imageDirectory", isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper),
                PropertyHelper.SetProperty(jObject, "outputDirectory", isBaseDirectoryValid, baseDirectory, taskId, pathValidatorHelper),
                (string) jObject.Property("fileName")
            );
        }
    }
}
