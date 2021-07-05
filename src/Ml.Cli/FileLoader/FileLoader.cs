﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Ml.Cli.FileLoader
{
    public class FileLoader : IFileLoader
    {

        public string Load(string basePath)
        {
            return File.ReadAllText(basePath);
        }
        
        public async Task<string> LoadAsync(string basePath)
        {
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
            await File.WriteAllBytesAsync(path, contents);
        }

        public async Task WriteAllTextInFileAsync(string path, string contents)
        {
            await File.WriteAllTextAsync(path, contents);
        }

        public async Task<string> ReadAllTextInFileAsync(string path)
        {
            return await File.ReadAllTextAsync(path);
        }

        public void CreateDirectory(string path)
        {
            if (!string.IsNullOrEmpty(path))
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
            }
        }

        public IEnumerable<string> EnumerateFiles(string path, string pattern)
        {
            return Directory.EnumerateFiles(path, pattern);
        }

        public IEnumerable<string> EnumerateDirectories(string path)
        {
            return Directory.EnumerateDirectories(path);
        }

        public IEnumerable<string> EnumerateFiles(string path)
        {
            return Directory.EnumerateFiles(path);
        }

        public virtual bool FileExists(string path)
        {
            return File.Exists(path);
        }

        public Stream OpenRead(string file)
        {
            return File.OpenRead(file);
        }
    }
}