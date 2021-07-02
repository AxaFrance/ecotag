using System;
using System.IO;

namespace Ml.Cli.WebApp.BasePath
{
    public class BasePath: IBasePath
    {
        public string Path { get; }

        public BasePath(string path)
        {
            Path = path;
        }

        public bool IsPathSecure(string path)
        {
            if (path == null)
            {
                return false;
            }
            if (!path.StartsWith(Path, StringComparison.Ordinal))
            {
                return false;
            }

            var pathWithoutBase = path.Remove(0, Path.Length);
            if (pathWithoutBase.Contains(@"..", StringComparison.Ordinal))
            {
                return false;
            }

            if (pathWithoutBase[0] == System.IO.Path.DirectorySeparatorChar)
            {
                return false;
            }

            if (!Directory.Exists(path) && !File.Exists(path))
            {
                return false;
            }

            return true;
        }
    }
}
