using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace Ml.Cli.DemoApi
{
    public interface IFileLoader
    {
        Task<string> LoadAsync(string basePath);
        Stream LoadStream(string basePath);
    }

    public class FileLoader : IFileLoader
    {
        private readonly ILogger<FileLoader> _logger;

        public FileLoader(ILogger<FileLoader> logger)
        {
            _logger = logger;
        }
        
        public Task<string> LoadAsync(string basePath)
        {
            var path = GetBasePath();
            _logger.LogInformation($"GetBasePath :{GetBasePath()}");
            var mailPath = Path.Combine(path, basePath);
            return File.ReadAllTextAsync(mailPath);
        }
        
        private string GetBasePath()
        {
            using var processModule = Process.GetCurrentProcess().MainModule;
            return Path.GetDirectoryName(processModule?.FileName);
        }

        public Stream LoadStream(string basePath)
        {
            var path = GetBasePath();
            _logger.LogInformation($"GetBasePath :{GetBasePath()}");
            var mailPath = Path.Combine(path, basePath);
            return File.OpenRead(mailPath);
        }
    }
}