using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Ml.Cli.PathManager;

namespace Ml.Cli.FileLoader
{
    public class FileLoader : IFileLoader
    {



        public string Load(string basePath)
        {
            basePath = PathAdapter.AdaptPathForCurrentOs(basePath);
            return File.ReadAllText(basePath);
        }
        
        public async Task<string> LoadAsync(string basePath)
        {
            basePath = PathAdapter.AdaptPathForCurrentOs(basePath);
            var path = Path.GetDirectoryName(typeof(FileLoader).Assembly.Location);
            if (path != null)
            {
                var mailPath = Path.Combine(path, basePath);
                return await File.ReadAllTextAsync(mailPath);
            }
            else
            {
                throw new ArgumentException("FileLoader : path is invalid");
            }
        }

        public async Task WriteAllBytesOfFileAsync(string path, byte[] contents)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            await File.WriteAllBytesAsync(path, contents);
        }

        public async Task WriteAllTextInFileAsync(string path, string contents)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            await File.WriteAllTextAsync(path, contents);
        }

        public async Task<string> ReadAllTextInFileAsync(string path)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            return await File.ReadAllTextAsync(path);
        }

        public void CreateDirectory(string path)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            if (string.IsNullOrEmpty(path)) return;
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }

        public IEnumerable<string> EnumerateFiles(string path, string pattern)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            return Directory.EnumerateFiles(path, pattern);
        }

        public IEnumerable<string> EnumerateDirectories(string path)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            return Directory.EnumerateDirectories(path);
        }

        public IEnumerable<string> EnumerateFiles(string path)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            return Directory.EnumerateFiles(path);
        }

        public virtual bool FileExists(string path)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            return File.Exists(path);
        }

        public Stream OpenRead(string path)
        {
            path = PathAdapter.AdaptPathForCurrentOs(path);
            return File.OpenRead(path);
        }
    }
}
