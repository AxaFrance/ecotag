using System.Linq;

namespace Ml.Cli.WebApp.Paths
{
    public class ComparesPaths
    {
        public string Paths { get; }
        public ComparesPaths(string comparesPaths)
        {
            Paths = comparesPaths;
        }

        public bool IsPathContained(string filePath) => Paths
                .Split(',')
                .Any(filePath.Contains);
    }
}