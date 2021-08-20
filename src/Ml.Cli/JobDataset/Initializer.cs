using System;
using Ml.Cli.Helper;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.JobDataset
{
    public class Initializer
    {
        public static DatasetTask CreateTask(JObject jObject, string type, bool enabled, bool isBaseDirectoryValid,
            string baseDirectory, string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            var isScriptDefined = jObject.Property("script", StringComparison.Ordinal) != null;
            var isConfigurationDefined = jObject.Property("configuration", StringComparison.Ordinal) != null;
            var script = isScriptDefined ? (string) jObject.Property("script") : string.Empty;
            var configuration = isConfigurationDefined ? (string) jObject.Property("configuration") : string.Empty;
            var frontDefaultStringMatcher =
                jObject.Property("frontDefaultStringsMatcher", StringComparison.Ordinal) != null;
            var frontDefaultStringsMatcherResult = frontDefaultStringMatcher
                ? (string) jObject.Property("frontDefaultStringsMatcher")
                : string.Empty;
            return new DatasetTask(
                taskId,
                type,
                enabled,
                (string) jObject.Property("annotationType"),
                configuration,
                PropertyHelper.SetProperty(jObject, "fileDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                    pathValidatorHelper),
                PropertyHelper.SetProperty(jObject, "imageDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                    pathValidatorHelper),
                PropertyHelper.SetProperty(jObject, "outputDirectory", isBaseDirectoryValid, baseDirectory, taskId,
                    pathValidatorHelper),
                frontDefaultStringsMatcherResult,
                (string) jObject.Property("fileName"),
                script
            );
        }
    }
}