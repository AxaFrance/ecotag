using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.FileLoader
{
    public interface IFileLoader
    {
        string Load(string basePath);
        Task<string> LoadAsync(string basePath);
        Task WriteAllBytesOfFileAsync(string path, byte[] contents);
        Task WriteAllTextInFileAsync(string path, string contents);
        Task<string> ReadAllTextInFileAsync(string path);
        void CreateDirectory(string path);
        IEnumerable<string> EnumerateFiles(string path, string pattern);
        IEnumerable<string> EnumerateDirectories(string path);
        IEnumerable<string> EnumerateFiles(string path);
        bool FileExists(string path);
        Stream OpenRead(string path);
    }
}
