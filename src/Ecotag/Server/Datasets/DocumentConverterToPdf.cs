﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AxaGuilDEv.Ecotag.Server.Datasets;

public class DocumentConverterToPdf
{
    private static SemaphoreSlim _semaphoreSlim;
    private static readonly List<int> _ports = new();
    private static readonly object _locker = new();
    private static readonly string _dirname = Guid.NewGuid().ToString();
    private readonly IOptions<DatasetsSettings> _datasetsSettings;
    private readonly ILogger<DocumentConverterToPdf> _logger;

    public DocumentConverterToPdf(IOptions<DatasetsSettings> datasetsSettings, ILogger<DocumentConverterToPdf> logger)
    {
        _datasetsSettings = datasetsSettings;
        _logger = logger;
    }

    public int LibreOfficeNumberWorker => _datasetsSettings.Value.LibreOfficeNumberWorker ?? Environment.ProcessorCount;

    public async Task<Stream> ConvertAsync(string filename, Stream inputStream)
    {
        lock (_locker)
        {
            if (_semaphoreSlim == null)
            {
                var numberWorker = LibreOfficeNumberWorker;
                _semaphoreSlim = new SemaphoreSlim(numberWorker, numberWorker);
            }
        }

        if (string.IsNullOrEmpty(_datasetsSettings.Value.LibreOfficeExePath)) return null;

        try
        {
            var basePath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            var exe = _datasetsSettings.Value.LibreOfficeExePath.Replace("{basePath}", basePath);

            var tempFilePathWithoutFileName = Path.GetTempPath();
            var fileTempPath = Path.Combine(tempFilePathWithoutFileName, Guid.NewGuid() + Path.GetFileName(filename));
            await using (var fileStream = File.Create(fileTempPath))
            {
                await inputStream.CopyToAsync(fileStream);
            }

            await _semaphoreSlim.WaitAsync(TimeSpan.FromSeconds(_datasetsSettings.Value.LibreOfficeTimeout + 2));
            try
            {
                await LaunchCommandLineAppAsync(exe, tempFilePathWithoutFileName, fileTempPath,
                    _datasetsSettings.Value.LibreOfficeTimeout);
            }
            finally
            {
                _semaphoreSlim.Release();
            }

            var pdfPath = $"{fileTempPath.Replace(Path.GetExtension(fileTempPath), "")}.pdf";
            if (File.Exists(pdfPath))
            {
                var outputStream = await File.ReadAllBytesAsync(pdfPath);
                var stream = new MemoryStream(outputStream);
                File.Delete(pdfPath);
                File.Delete(fileTempPath);
                return stream;
            }

            File.Delete(fileTempPath);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "LibreOffice Error converting document " + filename + " to PDF");
            return null;
        }
    }

    private static async Task LaunchCommandLineAppAsync(string libreOfficeExecutablePath, string directoryPath,
        string filePath, int timeoutMs = 20000)
    {
        directoryPath = directoryPath.TrimEnd(Path.DirectorySeparatorChar);

        var currentPort = 0;
        lock (_locker)
        {
            for (var i = 8100; i < 9000; i++)
            {
                if (_ports.Contains(i)) continue;
                _ports.Add(i);
                currentPort = i;
                break;
            }

            if (currentPort == 0) throw new Exception("No port found");
        }

        var userPath = Path.Combine(Path.GetTempPath(), _dirname, currentPort.ToString()).Replace("\\", "/");
        Directory.CreateDirectory(userPath);

        var argument =
            $"/C -nofirststartwizard \"-env:UserInstallation=file:///{userPath}/\" -accept=\"socket,host=0.0.0.0,port={currentPort.ToString()};urp;\" -headless -convert-to pdf -outdir \"{directoryPath}\" \"{filePath}\"";
        var startInfo = new ProcessStartInfo
        {
            CreateNoWindow = true,
            UseShellExecute = false,
            FileName = libreOfficeExecutablePath,
            WindowStyle = ProcessWindowStyle.Hidden,
            Arguments = argument,
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };
        var cmd = new Process();
        string stdError;
        var output = new StringBuilder();
        try
        {
            cmd.StartInfo = startInfo;
            cmd.OutputDataReceived += (sender, args) => output.AppendLine(args.Data);

            cmd.Start();
            cmd.BeginOutputReadLine();
            cmd.WaitForExit(timeoutMs);
            stdError = await cmd.StandardError.ReadToEndAsync();
            if (cmd.HasExited == false)
                if (cmd.Responding)
                    cmd.CloseMainWindow();
                else
                    cmd.Kill();
        }
        catch (Exception e)
        {
            throw new Exception($"OS error while executing: {e.Message}");
        }
        finally
        {
            lock (_locker)
            {
                _ports.Remove(currentPort);
            }
        }

        if (cmd.ExitCode != 0) throw new Exception($"Finished with exit code = {cmd.ExitCode}: {stdError}");

        var stdOut = output.ToString();

        Console.WriteLine(stdOut);
    }
}