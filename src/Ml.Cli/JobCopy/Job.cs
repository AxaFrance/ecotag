using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Version = Ml.Cli.JobVersion.Version;

namespace Ml.Cli.JobCopy
{
    public class TaskCopy
    {
        private readonly IFileLoader _fileLoader;
        private readonly ILogger<TaskCopy> _logger;

        public TaskCopy(IFileLoader fileLoader, ILogger<TaskCopy> logger)
        {
            _fileLoader = fileLoader;
            _logger = logger;
        }

        public async Task CopyAsync(CopyTask inputTask)
        {
            _fileLoader.CreateDirectory(inputTask.To);
           var files = _fileLoader.EnumerateFiles(inputTask.From, inputTask.Pattern);
           foreach (var file in files)
           {
               _fileLoader.Copy(file, Path.Combine(inputTask.To, Path.GetFileName(file)));
               _logger.LogInformation($"Copy file {inputTask.From} to {inputTask.From}");
           }
        }
    }
}