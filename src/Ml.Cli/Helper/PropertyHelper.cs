using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.Helper
{
    public static class PropertyHelper
    {
        public static string SetProperty(JObject jObject, string property, bool isBaseDirectoryValid, string baseDirectory,
            string taskId, IPathValidatorHelper pathValidatorHelper)
        {
            var resultProperty = (string) jObject.Property(property, StringComparison.Ordinal);
            if (!pathValidatorHelper.IsPathValid(resultProperty, taskId))
            {
                if (!isBaseDirectoryValid)
                {
                    throw new ArgumentException(
                        $"Task Id: {taskId} - Cannot create correct path for task. Please enter a valid base directory and correct endpoints in tasks.json.");
                }
                else
                {
                    return Path.Combine(baseDirectory, resultProperty!);
                }
            }

            return resultProperty;
        }
    }
}
