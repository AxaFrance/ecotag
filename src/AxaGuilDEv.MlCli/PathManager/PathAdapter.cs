using System.IO;

namespace Ml.Cli.PathManager;

public class PathAdapter
{
    public static string AdaptPathForCurrentOs(string path)
    {
        if (string.IsNullOrEmpty(path)) return path;
        return path.Replace(Path.DirectorySeparatorChar == '/' ? '\\' : '/', Path.DirectorySeparatorChar);
    }
}