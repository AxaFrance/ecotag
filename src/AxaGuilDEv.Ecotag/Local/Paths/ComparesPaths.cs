using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Local.Paths;

public class ComparesPaths
{
    public ComparesPaths(string paths)
    {
        Paths = PathAdapter.AdaptPathForCurrentOs(paths);
    }

    public string Paths { get; }
}