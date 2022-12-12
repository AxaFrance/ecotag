using System;
using System.IO;
using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Local.Paths;

public class BasePath
{
    public BasePath(string path)
    {
        path = PathAdapter.AdaptPathForCurrentOs(path);
        Path = path;
    }

    public string Path { get; }

    public virtual bool IsPathSecure(string path)
    {
        if (path == null) return false;

        path = PathAdapter.AdaptPathForCurrentOs(path);
        var currentPath = System.IO.Path.GetFullPath(path);
        var currentBasePath = System.IO.Path.GetFullPath(Path);
        if (!currentPath.StartsWith(currentBasePath, StringComparison.Ordinal)) return false;

        var pathWithoutBase = currentPath.Remove(0, Path.Length);
        if (pathWithoutBase.Contains(@"..", StringComparison.Ordinal)) return false;

        if (pathWithoutBase[0] == System.IO.Path.DirectorySeparatorChar) return false;

        return Directory.Exists(currentPath) || File.Exists(currentPath);
    }
}