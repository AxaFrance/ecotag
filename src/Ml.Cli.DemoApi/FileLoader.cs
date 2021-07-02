using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Ml.Cli.DemoApi
{
    public interface IFileLoader
    {
        Task<string> LoadAsync(string basePath);
        Stream LoadStream(string basePath);
    }

    public class FileLoader : IFileLoader
    {
        public Task<string> LoadAsync(string basePath)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var mailPath = Path.Combine(path, basePath);
            return File.ReadAllTextAsync(mailPath);
        }


        public Stream LoadStream(string basePath)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var mailPath = Path.Combine(path, basePath);
            return File.OpenRead(mailPath);
        }
    }
}