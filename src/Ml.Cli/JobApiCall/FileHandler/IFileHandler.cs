using Ml.Cli.FileLoader;

namespace Ml.Cli.JobApiCall.FileHandler
{
    public interface IFileHandler
    {
        string SetFileName(string path, IFileLoader fileLoader);
    }
}
