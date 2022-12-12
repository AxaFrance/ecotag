using System;
using System.IO;
using AxaGuilDEv.MlCli.FileLoader;

namespace AxaGuilDEv.MlCli.JobApiCall.FileHandler;

public class FileHandler : IFileHandler
{
    public string SetFileName(string path, IFileLoader fileLoader)
    {
        var directory = Path.GetDirectoryName(path);
        var fileName = Path.GetFileNameWithoutExtension(path);
        var extension = Path.GetExtension(path);
        var tempName = fileName + extension;
        var count = 0;
        if (directory == null) throw new Exception("Directory of file " + path + " not found.");
        if (fileLoader == null) throw new Exception("Fileloader parameter is null.");
        while (fileLoader.FileExists(Path.Combine(directory, tempName)))
        {
            count++;
            tempName = fileName + "_" + count + extension;
        }

        return Path.Combine(directory, tempName);
    }
}