using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Projects.Cmd;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetsRepository
{
    public const string AlreadyTakenName = "AlreadyTakenName";
    public const string FileNotFound = "FileNotFound";
    public const string DownloadError = "DownloadError";
    private readonly DatasetContext _datasetContext;
    private readonly IMemoryCache _cache;
    private readonly IFileService _fileService;
    private readonly ImportDatasetFilesService _importDatasetFilesService;
    private readonly DocumentConverterToPdf _documentConverterToPdf;
    private IList<string> extentions = new List<string>() { ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".tif", ".tiff", ".rtf", ".odt", ".ods", ".odp" };

    public DatasetsRepository(DatasetContext datasetsContext, IFileService fileService, IMemoryCache cache, ImportDatasetFilesService importDatasetFilesService, DocumentConverterToPdf documentConverterToPdf= null)
    {
        _datasetContext = datasetsContext;
        _fileService = fileService;
        _cache = cache;
        _importDatasetFilesService = importDatasetFilesService;
        _documentConverterToPdf = documentConverterToPdf;
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var isImported = createDataset.ImportedDatasetName != null;
        var blobSource = isImported ? "TransferFileStorage" : "FileStorage";
        var blobName = isImported ? "input/" + createDataset.ImportedDatasetName : Guid.NewGuid().ToString();
        var datasetModel = new DatasetModel
        {
            Name = createDataset.Name,
            BlobUri = $"azureblob://{blobSource}/{blobName}", 
            Classification = createDataset.Classification.ToDatasetClassification(),
            Type = createDataset.Type.ToDatasetType(),
            CreateDate = DateTime.Now.Ticks,
            GroupId = Guid.Parse(createDataset.GroupId),
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier,
            Locked =isImported ? DatasetLockedEnumeration.Pending : DatasetLockedEnumeration.None
        };
        var result = _datasetContext.Datasets.AddIfNotExists(datasetModel, group => group.Name == datasetModel.Name);
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }

        try
        {
            await _datasetContext.SaveChangesAsync();
            if (createDataset.ImportedDatasetName != null)
            {
                // Fire and Forget
                _importDatasetFilesService.ImportFilesAsync(createDataset.ImportedDatasetName, datasetModel.Id.ToString(), datasetModel.Type, datasetModel.CreatorNameIdentifier);
            }
        }
        catch (Exception)
        {
            commandResult.Error = new ErrorResult { Key = DownloadError };
            return commandResult;
        }

        commandResult.Data = datasetModel.Id.ToString();
        return commandResult;
    }

    public async Task<IList<ListDataset>> ListDatasetAsync(DatasetLockedEnumeration? locked, IList<string> groupIds)
    {
        IList<DatasetModel> datasets;
        if (locked.HasValue)
            datasets = await _datasetContext.Datasets.AsNoTracking()
                .Where(dataset => dataset.Locked == locked && groupIds.Contains(dataset.GroupId.ToString()))
                .Include(dataset => dataset.Files).ToListAsync();
        else
            datasets = await _datasetContext.Datasets.AsNoTracking()
                .Where(dataset => groupIds.Contains(dataset.GroupId.ToString())).Include(dataset => dataset.Files)
                .ToListAsync();
        return datasets.Select(d => d.ToListDatasetResult()).ToList();
    }

    public async Task<GetDataset> GetDatasetAsync(string datasetId)
    {
        var dataset = await _datasetContext.Datasets.AsNoTracking()
            .Where(dataset => dataset.Id == new Guid(datasetId))
            .Include(dataset => dataset.Files)
            .FirstOrDefaultAsync();
        return dataset?.ToGetDataset();
    }

    public async Task<GetDatasetInfo> GetDatasetInfoAsync(string datasetId)
    {
        var dataset = await _cache.GetOrCreateAsync($"GetDatasetInfoAsync({datasetId})", async entry =>
        {
            var dataset = await _datasetContext.Datasets.AsNoTracking()
                .Where(dataset => dataset.Id == new Guid(datasetId)).Select(dataset => new GetDatasetInfo
                {
                    Id = dataset.Id.ToString().ToLower(),
                    Name = dataset.Name,
                    GroupId = dataset.GroupId.ToString().ToLower(),
                    Type = dataset.Type.ToString(),
                    Locked = dataset.Locked,
                    Classification = dataset.Classification,
                    BlobUri = dataset.BlobUri,
                })
                .FirstOrDefaultAsync();
            entry.AbsoluteExpirationRelativeToNow =
                dataset == null ? TimeSpan.FromMilliseconds(1) : TimeSpan.FromHours(1);
            entry.SlidingExpiration = TimeSpan.FromMinutes(1);
            return dataset;
        });
        return dataset;
    }

    public async Task<bool> LockAsync(string datasetId)
    {
        var dataset = await _datasetContext.Datasets.FirstOrDefaultAsync(dataset => dataset.Id == new Guid(datasetId));
        if (dataset == null || dataset.Locked == DatasetLockedEnumeration.Locked) return false;
        dataset.Locked = DatasetLockedEnumeration.Locked;
        await _datasetContext.SaveChangesAsync();
        _cache.Remove($"GetDatasetInfoAsync({datasetId})");
        return true;
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> GetFileAsync(string datasetId, string fileId, bool isTakePdfConvertionIdAvailable=false)
    {
        var result = new ResultWithError<FileServiceDataModel, ErrorResult>();
        var file = await _datasetContext.Files.Include(f => f.Dataset).AsNoTracking().Where(file =>
            file.Id == new Guid(fileId) && file.DatasetId == new Guid(datasetId)).Select(f => new {Filename = f.Name, f.ContentType, BlobDirectoryUri = f.Dataset.BlobUri}).FirstOrDefaultAsync();
        if (file == null)
        {
            result.Error = new ErrorResult
            {
                Key = FileNotFound
            };
            return result;
        }

        if (isTakePdfConvertionIdAvailable && extentions.Contains(Path.GetExtension(file.Filename)))
        {
            var fileNamePdf = $"{file.Filename}.pdf";
            var isFileExist = await _fileService.IsFileExistAsync($"{file.BlobDirectoryUri}/{fileNamePdf}");
            if (isFileExist)
            {
                var fileDownloadedPdf = await _fileService.DownloadAsync($"{file.BlobDirectoryUri}/{fileNamePdf}");
                if (!fileDownloadedPdf.IsSuccess)
                {
                    return fileDownloadedPdf;
                }

                var fileServiceDataModelPdf = fileDownloadedPdf.Data;
                result.Data = fileServiceDataModelPdf with { ContentType = "application/pdf" };
                return result;
            }
        }

        var fileDownloaded = await _fileService.DownloadAsync($"{file.BlobDirectoryUri}/{file.Filename}");
        if (!fileDownloaded.IsSuccess)
        {
            return fileDownloaded;
        }

        var fileServiceDataModel = fileDownloaded.Data;
        result.Data = fileServiceDataModel with { ContentType = file.ContentType };
        return result;
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateFileAsync(string datasetId, Stream stream,
        string fileName, string contentType, string creatorNameIdentifier)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var fileModel = new FileModel
        {
            Name = fileName,
            ContentType = contentType,
            CreatorNameIdentifier = creatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = stream.Length,
            DatasetId = new Guid(datasetId)
        };
        var result = _datasetContext.Files.AddIfNotExists(fileModel,
            file => file.Name == fileName && file.DatasetId == new Guid(datasetId));
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }

        try
        {
            var taskSaveSql = _datasetContext.SaveChangesAsync();
            var datasetInfo = await GetDatasetInfoAsync(datasetId);
            var taskUploadBlob = _fileService.UploadStreamAsync($"{datasetInfo.BlobUri}/{fileName}", stream);
            
            Task.WaitAll(taskSaveSql, taskUploadBlob);
            if (extentions.Contains(Path.GetExtension(fileName)))
            {
                stream.Position = 0;
                var streamPdf = await _documentConverterToPdf.Convert(fileName, stream);
                if (streamPdf == null)
                {
                    await _fileService.UploadStreamAsync($"{datasetInfo.BlobUri}/{fileName}.pdf", streamPdf);
                }
            }

        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        finally
        {
            await stream.DisposeAsync();    
        }

        commandResult.Data = fileModel.Id.ToString();
        return commandResult;
    }

    public async Task<ResultWithError<bool, ErrorResult>> DeleteFileAsync(string datasetId, string fileId)
    {
        var result = new ResultWithError<bool, ErrorResult>();
        var file = await _datasetContext.Files.FirstOrDefaultAsync(file =>
            file.Id == new Guid(fileId) && file.DatasetId == new Guid(datasetId));
        if (file == null)
        {
            result.Error = new ErrorResult
            {
                Key = FileNotFound
            };
            return result;
        }

        _datasetContext.Files.Remove(file);

        var datasetInfo = await this.GetDatasetInfoAsync(datasetId);
        var taskDeleteSql = _datasetContext.SaveChangesAsync();
        var taskDeleteBob = _fileService.DeleteAsync($"{datasetInfo.BlobUri}/{file.Name}");
        Task.WaitAll(taskDeleteSql, taskDeleteBob);
        result.Data = taskDeleteBob.Result;
        return result;
    }
}