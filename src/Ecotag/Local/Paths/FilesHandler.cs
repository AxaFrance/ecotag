using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AxaGuilDEv.MlCli.FileLoader;
using AxaGuilDEv.MlCli.PathManager;

namespace AxaGuilDEv.Ecotag.Local.Paths;

public static class FilesHandler
{
    public static IEnumerable<string> GetFilesFromPaths(string paths, BasePath basePath, IFileLoader fileLoader)
    {
        var jsonExtension = ".json";
        var pathsArray = paths.Split(Separators.CommaSeparator);
        var fullyQualifiedPaths =
            pathsArray.Select(path =>
                PathAdapter.AdaptPathForCurrentOs(Path.IsPathRooted(path) ? path : Path.Combine(basePath.Path, path)));
        //paths out of the security directory are ignored
        var correctPaths =
            fullyQualifiedPaths.Where(basePath.IsPathSecure);

        var results = correctPaths
            .SelectMany(fileLoader.EnumerateFiles)
            .Where(file => Path.GetExtension(file) == jsonExtension);
        return results;
    }

    public static IEnumerable<FileInfo> GetFilesFromDirectoryPath(string directoryPath, BasePath basePath,
        IFileLoader fileLoader)
    {
        var fullyQualifiedPath =
            PathAdapter.AdaptPathForCurrentOs(Path.IsPathRooted(directoryPath)
                ? directoryPath
                : Path.Combine(basePath.Path, directoryPath));
        if (!basePath.IsPathSecure(fullyQualifiedPath)) return null;

        var files = fileLoader.EnumerateFiles(fullyQualifiedPath);
        var filesInfoList = new List<FileInfo>();
        foreach (var file in files) filesInfoList.Add(new FileInfo(file, File.GetCreationTime(file)));

        return filesInfoList;
    }

    public class FileInfo
    {
        public FileInfo(string file, DateTime date)
        {
            File = file;
            Date = date;
        }

        public string File { get; set; }
        public DateTime Date { get; set; }
    }
}