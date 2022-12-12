using AxaGuilDEv.MlCli.FileLoader;

namespace AxaGuilDEv.MlCli.JobApiCall.FileHandler;

public interface IFileHandler
{
    string SetFileName(string path, IFileLoader fileLoader);
}