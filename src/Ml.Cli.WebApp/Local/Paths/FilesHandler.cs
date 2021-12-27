using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Ml.Cli.FileLoader;
using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Paths
{
    public static class FilesHandler
    {
        public class FileInfo
        {
            public string File { get; set; }
            public DateTime Date { get; set; }

            public FileInfo(string file, DateTime date)
            {
                File = file;
                Date = date;
            }
        }
        
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

        public static IEnumerable<FileInfo> GetFilesFromDirectoryPath(string directoryPath, BasePath basePath,
            IFileLoader fileLoader)
        {
            var fullyQualifiedPath =
                PathAdapter.AdaptPathForCurrentOs(Path.IsPathRooted(directoryPath)
                    ? directoryPath
                    : Path.Combine(basePath.Path, directoryPath));
            if (!basePath.IsPathSecure(fullyQualifiedPath))
            {
                return null;
            }
            
            var files = fileLoader.EnumerateFiles(fullyQualifiedPath);
            var filesInfoList = new List<FileInfo>();
            foreach (var file in files)
            {
                filesInfoList.Add(new FileInfo(file, File.GetCreationTime(file)));
            }

            return filesInfoList;
        }
    }
}