using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Local.Paths
{
    public class DatasetsPaths
    {
        public string Paths { get; }

        public DatasetsPaths(string paths)
        {
            Paths = PathAdapter.AdaptPathForCurrentOs(paths);
        }
    }
}