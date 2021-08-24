using System.Linq;

namespace Ml.Cli.WebApp.Paths
{
    public class FilesPaths
    {
        public string ComparePaths { get; }
        public string DatasetPaths { get; }
        public FilesPaths(string comparesComparePaths, string datasetPaths)
        {
            ComparePaths = comparesComparePaths;
            DatasetPaths = datasetPaths;
        }
        
        public bool ArePathsContained(string filePaths, string pathsList) => pathsList
            .Split(',')
            .Any(filePaths.Contains);
    }
}
