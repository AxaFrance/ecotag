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
        
        public bool IsPathContained(string filePath) => Paths
            .Split(',')
            .Any(filePath.Contains);
    }
}