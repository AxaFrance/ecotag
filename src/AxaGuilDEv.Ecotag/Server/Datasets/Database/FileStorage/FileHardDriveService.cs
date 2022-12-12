using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.StaticFiles;
using Ml.Cli.PathManager;

namespace Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

public class FileHardDriveService : IFileService
{
    private readonly string _basePath;

    public FileHardDriveService()
    {
        _basePath = Path.Combine("./", ".data");
    }

    public async Task UploadStreamAsync(string blobFileUri, Stream fileStream)
    {
        blobFileUri = AdaptBlobToHardDrive(blobFileUri);
        var info = new DirectoryInfo(Path.GetDirectoryName(blobFileUri));
        if (!info.Exists) info.Create();

        await using var outputFileStream = new FileStream(blobFileUri, FileMode.Create);
        await fileStream.CopyToAsync(outputFileStream);
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> DownloadAsync(string blobFileUri)
    {
        blobFileUri = AdaptBlobToHardDrive(blobFileUri);
        var file = new FileInfo(blobFileUri);
        if (!file.Exists)
            return new ResultWithError<FileServiceDataModel, ErrorResult>
            {
                Error = new ErrorResult
                {
                    Key = "FileNotFound"
                }
            };
        var fsSource = new FileStream(blobFileUri,
            FileMode.Open, FileAccess.Read);
        var provider = new FileExtensionContentTypeProvider();
        string contentType;
        if (!provider.TryGetContentType(blobFileUri, out contentType)) contentType = "application/octet-stream";
        var dataModel = new FileServiceDataModel
        {
            Stream = fsSource,
            Name = fsSource.Name,
            Length = fsSource.Length,
            ContentType = contentType
        };

        var result = new ResultWithError<FileServiceDataModel, ErrorResult>
        {
            Data = dataModel
        };
        return result;
    }

    public async Task<bool> DeleteAsync(string blobFileUri)
    {
        blobFileUri = AdaptBlobToHardDrive(blobFileUri);
        var file = new FileInfo(blobFileUri);
        if (!file.Exists) return false;
        file.Delete();
        return true;
    }

    public async Task<bool> DeleteDirectoryAsync(string blobDirectoryUri)
    {
        blobDirectoryUri = AdaptBlobToHardDrive(blobDirectoryUri);
        var directory = new DirectoryInfo(blobDirectoryUri);
        if (!directory.Exists) return false;
        RecursiveDelete(directory);
        return true;
    }

    public Task<IList<string>> GetImportedDatasetsNamesAsync(string blobUri)
    {
        throw new NotImplementedException();
    }

    public Task<IDictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>> GetInputDatasetFilesAsync(
        string blobUri, string datasetType)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> IsFileExistAsync(string blobUri)
    {
        blobUri = AdaptBlobToHardDrive(blobUri);
        var file = new FileInfo(blobUri);
        return file.Exists;
    }

    private string AdaptBlobToHardDrive(string blobFileUri)
    {
        blobFileUri = blobFileUri.Replace("azureblob://", _basePath + "/");
        blobFileUri = PathAdapter.AdaptPathForCurrentOs(blobFileUri);
        return blobFileUri;
    }

    private static void RecursiveDelete(DirectoryInfo baseDir)
    {
        if (!baseDir.Exists)
            return;

        foreach (var dir in baseDir.EnumerateDirectories()) RecursiveDelete(dir);
        var files = baseDir.GetFiles();
        foreach (var file in files)
        {
            file.IsReadOnly = false;
            file.Delete();
        }

        baseDir.Delete();
    }
}