using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public class GetProjectFileCmd
{
    private const string UserNotInGroup = "UserNotInGroup";
    private const string UserNotFound = "UserNotFound";
    public const string DatasetNotFound = "DatasetNotFound";
    private readonly DatasetsRepository _datasetsRepository;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public GetProjectFileCmd(UsersRepository usersRepository, DatasetsRepository datasetsRepository, ProjectsRepository projectsRepository)
    {
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
        _projectsRepository = projectsRepository;
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> ExecuteAsync(string projectId, string fileId,
        string nameIdentifier)
    {
        var commandResult = new ResultWithError<FileServiceDataModel, ErrorResult>();
        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(nameIdentifier);
        if (user == null) return commandResult.ReturnError(UserNotFound);
        
        var projectResult = await _projectsRepository.GetProjectAsync(projectId, user.GroupIds);
        if (!projectResult.IsSuccess) return commandResult.ReturnError(projectResult.Error.Key);

        var project = projectResult.Data;
        var datasetId = project.DatasetId;
        var datasetInfo = await _datasetsRepository.GetDatasetInfoAsync(datasetId);
        if (datasetInfo == null) return commandResult.ReturnError(DatasetNotFound);
        if (!user.GroupIds.Contains(datasetInfo.GroupId)) return commandResult.ReturnError(UserNotInGroup);

       var file= await _datasetsRepository.GetFileAsync(datasetId, fileId);

       var extentions = new List<string>() { ".doc", ".docx", ".tif", ".tiff", ".rtf", ".odt" };
       if (file.IsSuccess)
       {
           if ( extentions.Contains(Path.GetExtension(file.Data.Name)))
           {
               var newStream = await NewMethod(file.Data.Name, file.Data.Stream);
               var res = new ResultWithError<FileServiceDataModel, ErrorResult>();
               res.Data = new FileServiceDataModel()
               {
                   Stream = newStream,
                   Length = newStream.Position,
                   Name = file.Data.Name + ".pdf",
                   ContentType = "application/pdf"
               };
               return res;
           }
       }

       return file;
    }
    
        private static async Task<Stream> NewMethod(string filename, Stream inputStream)
    {
        var tempFilePathWithoutFileName = Path.GetTempPath();
        var fileTempPath = Path.Combine(tempFilePathWithoutFileName, Path.GetFileName(filename));
        await using (var fileStream = File.Create(fileTempPath))
        {
            //inputStream.Seek(0, SeekOrigin.Begin);
            await inputStream.CopyToAsync(fileStream);
        }

        var exe = @"C:\Users\A115VC\Desktop\LibreOfficePortable\LibreOfficePortable.exe";
        await LaunchCommandLineAppAsync(exe, tempFilePathWithoutFileName, fileTempPath);
        // await Task.Delay(15000);
        var listFile = Directory.EnumerateFiles(tempFilePathWithoutFileName);
        string pdfPath = fileTempPath.Replace(Path.GetExtension(fileTempPath), "") + ".pdf";
        if (File.Exists(pdfPath))
        {
            var outputStream = await System.IO.File.ReadAllBytesAsync(pdfPath);
            MemoryStream stream = new MemoryStream(outputStream);
            File.Delete(pdfPath);
            File.Delete(fileTempPath);
            return stream;
        }
        File.Delete(fileTempPath);

        return null;
    }

    static async Task LaunchCommandLineAppAsync(string libreOfficeExecutablePath, string directoryPath, string filePath)
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
            await cmd.WaitForExitAsync();
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