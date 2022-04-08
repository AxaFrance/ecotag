using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Local.Paths
{
    public class ComparesPaths
    {
        public string Paths { get; }

        public ComparesPaths(string paths)
        {
            Paths = PathAdapter.AdaptPathForCurrentOs(paths);
        }
    }
}