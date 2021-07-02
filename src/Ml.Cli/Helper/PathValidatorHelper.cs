using System;
using System.IO;

namespace Ml.Cli.Helper
{
    public class PathValidatorHelper : IPathValidatorHelper
    {
        public bool IsPathValid(string path, string taskId)
        {
            if (path.IndexOfAny(Path.GetInvalidPathChars()) >= 0)
            {
                throw new ArgumentException($"Task Id: {taskId} - Path contains invalid characters");
            }

            return Directory.Exists(path);
        }
    }
}
