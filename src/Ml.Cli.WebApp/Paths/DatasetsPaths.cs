using System.Linq;

namespace Ml.Cli.WebApp.Paths
{
    public class DatasetsPaths
    {
        public string Paths { get; }

        public DatasetsPaths(string paths)
        {
            Paths = paths;
        }
    }
}