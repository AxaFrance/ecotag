using System;
using System.IO;
using Newtonsoft.Json.Linq;

namespace AxaGuilDEv.MlCli.PathManager;

public static class PropertyHelper
{
    public static string SetProperty(JObject jObject, string property, bool isBaseDirectoryValid, string baseDirectory,
        string taskId, IPathValidatorHelper pathValidatorHelper)
    {
        baseDirectory = PathAdapter.AdaptPathForCurrentOs(baseDirectory);
        var resultProperty = (string)jObject.Property(property, StringComparison.Ordinal);
        resultProperty = PathAdapter.AdaptPathForCurrentOs(resultProperty);
        if (pathValidatorHelper.IsPathValid(resultProperty, taskId)) return resultProperty;
        if (!isBaseDirectoryValid)
            throw new ArgumentException(
                $"Task Id: {taskId} - Cannot create correct path for task. Please enter a valid base directory and correct endpoints in tasks.json.");
        return Path.Combine(baseDirectory, resultProperty!);
    }
}