namespace Ml.Cli.WebApp.ComparesPaths
{
    public class ComparesPaths
    {
        public string Paths { get; }
        public ComparesPaths(string comparesPaths)
        {
            Paths = comparesPaths;
        }

        public bool IsPathContained(string filePath)
        {
            var paths = Paths.Split(',');
            foreach (var path in paths)
            {
                if (filePath.Contains(path))
                {
                    return true;
                }
            }

            return false;
        }
    }
}