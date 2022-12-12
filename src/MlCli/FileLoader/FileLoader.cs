using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.PathManager;

namespace AxaGuilDEv.MlCli.FileLoader;

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
        var path = GetBasePath();
        if (path == null) throw new ArgumentException("FileLoader : path is invalid");
        var mailPath = Path.Combine(path, basePath);
        return await File.ReadAllTextAsync(mailPath);
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
        if (!Directory.Exists(path)) Directory.CreateDirectory(path);
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

    public void Copy(string from, string to)
    {
        from = PathAdapter.AdaptPathForCurrentOs(from);
        to = PathAdapter.AdaptPathForCurrentOs(to);
        File.Copy(from, to);
    }

    private string GetBasePath()
    {
        using var processModule = Process.GetCurrentProcess().MainModule;
        return Path.GetDirectoryName(processModule?.FileName);
    }
}