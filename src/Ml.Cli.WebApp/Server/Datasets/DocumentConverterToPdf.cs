using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Ml.Cli.WebApp.Server.Datasets;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class DocumentConverterToPdf
{
    private readonly IOptions<DatasetsSettings> _datasetsSettings;
    private readonly ILogger<DocumentConverterToPdf> _logger;
    private readonly static SemaphoreSlim semaphoreSlim= new SemaphoreSlim(1, 1);

    public DocumentConverterToPdf(IOptions<DatasetsSettings> datasetsSettings, ILogger<DocumentConverterToPdf> logger)
    {
        _datasetsSettings = datasetsSettings;
        _logger = logger;
    }
    
    public async Task<Stream> ConvertAsync(string filename, Stream inputStream)
    {
        if (string.IsNullOrEmpty(_datasetsSettings.Value.LibreOfficeExePath))
        {
            return null;
        }

        try
        {
            var basePath = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location);
            var exe = $"{basePath}\\LibreOfficePortable\\LibreOfficePortable.exe";
            var tempFilePathWithoutFileName = Path.GetTempPath();
            var fileTempPath = Path.Combine(tempFilePathWithoutFileName, Path.GetFileName(filename));
            await using (var fileStream = File.Create(fileTempPath))
            {
                await inputStream.CopyToAsync(fileStream);
            }
            await semaphoreSlim.WaitAsync();
            try
            {
                await LaunchCommandLineAppAsync(exe, tempFilePathWithoutFileName, fileTempPath,
                    _datasetsSettings.Value.LibreOfficeTimeout);
            }
            finally
            {
                semaphoreSlim.Release();
            }
            var pdfPath = $"{fileTempPath.Replace(Path.GetExtension(fileTempPath), "")}.pdf";
            if (File.Exists(pdfPath))
            {
                var outputStream = await System.IO.File.ReadAllBytesAsync(pdfPath);
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
            _logger.LogError(ex, "LibreOffice Error converting document "+filename+" to PDF");
            return null;
        }
    }

    static async Task LaunchCommandLineAppAsync(string libreOfficeExecutablePath, string directoryPath, string filePath, int timeoutMs=20000)
    {
        directoryPath = directoryPath.TrimEnd(Path.DirectorySeparatorChar);
        var startInfo = new ProcessStartInfo
        {
            CreateNoWindow = true,
            UseShellExecute = false,
            FileName = libreOfficeExecutablePath, 
            WindowStyle = ProcessWindowStyle.Hidden,
            Arguments = $"/C -headless -writer  -convert-to pdf -outdir \"{directoryPath}\" \"{filePath}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true
        };
        var cmd = new Process();
        cmd.StartInfo = startInfo;
        var output = new StringBuilder();
        cmd.OutputDataReceived += (sender, args) => output.AppendLine(args.Data);
        string stdError;
        try 
        {
            cmd.Start();
            cmd.BeginOutputReadLine();
            stdError = await cmd.StandardError.ReadToEndAsync();
            cmd.WaitForExit(timeoutMs);
            if (cmd.HasExited == false)
                if (cmd.Responding)
                    cmd.CloseMainWindow();
                else
                    cmd.Kill();
        }
        catch (Exception e)
        {
            throw new Exception("OS error while executing: " + e.Message);
        }

        if (cmd.ExitCode != 0)
        {
            throw new Exception("Finished with exit code = " + cmd.ExitCode + ": " + stdError);
        }

        var stdOut = output.ToString();
        
        Console.WriteLine(stdOut);
    }
}