using System.Collections.Generic;
using System.IO;
using System.Linq;
using Ml.Cli.FileLoader;
using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Paths
{
    public static class FilesHandler
    {
        public static IEnumerable<string> GetFilesFromPaths(string paths, BasePath basePath, IFileLoader fileLoader)
        {
            var jsonExtension = ".json";
            var pathsArray = paths.Split(Separators.CommaSeparator);
            var fullyQualifiedPaths =
                pathsArray.Select(path => PathAdapter.AdaptPathForCurrentOs(Path.IsPathRooted(path) ? path : Path.Combine(basePath.Path, path)));
            //paths out of the security directory are ignored
            var correctPaths =
                fullyQualifiedPaths.Where(basePath.IsPathSecure);
            
            return correctPaths
                .SelectMany(fileLoader.EnumerateFiles)
                .Where(file => Path.GetExtension(file) == jsonExtension);
        }
    }
}