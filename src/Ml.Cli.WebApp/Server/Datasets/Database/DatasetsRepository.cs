using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Ml.Cli.WebApp.Server.Datasets.BlobStorage;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetCreationResult
{
    public string DatasetId { get; set; }
    public Dictionary<string, string> FilesResult { get; set; }
}

public class DatasetsRepository
{
    public const string AlreadyTakenName = "AlreadyTakenName";
    public const string FileNotFound = "FileNotFound";
    public const string FileTooLarge = "FileTooLarge";
    public const string UploadError = "UploadError";
    private const int ChunkSize = 20;
    private readonly DatasetContext _datasetContext;
    private readonly IMemoryCache _cache;
    private readonly IFileService _fileService;
    private readonly ITransferService _transferService;

    public DatasetsRepository(DatasetContext datasetsContext, IFileService fileService, ITransferService transferService, IMemoryCache cache)
    {
        _datasetContext = datasetsContext;
        _fileService = fileService;
        _transferService = transferService;
        _cache = cache;
    }

    public async Task<ResultWithError<DatasetCreationResult, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset)
    {
        var commandResult = new ResultWithError<DatasetCreationResult, ErrorResult>();
        var filesDict = new Dictionary<string, string>();
        var datasetModel = new DatasetModel
        {
            Name = createDataset.Name,
            Classification = createDataset.Classification.ToDatasetClassification(),
            Type = createDataset.Type.ToDatasetType(),
            CreateDate = DateTime.Now.Ticks,
            GroupId = Guid.Parse(createDataset.GroupId),
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier,
            IsLocked = createDataset.ImportedDatasetName != null
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
                var filesResult = await _transferService.DownloadDatasetFilesAsync("input", createDataset.ImportedDatasetName, datasetModel.Id.ToString(), datasetModel.Type.ToString());
                var koFiles = filesResult.Where(file => !file.Value.IsSuccess).ToList();
                var okFiles = filesResult.Where(file => file.Value.IsSuccess).ToList();
                
                foreach (var file in koFiles)
                {
                    filesDict.Add(file.Key, file.Value.Error.Key);
                }

                if (okFiles.Any())
                {
                    var chunkList = okFiles.Chunk(ChunkSize);
                    foreach (var chunk in chunkList)
                    {
                        var chunkResults = await CreateFilesAsync(chunk, datasetModel.Id.ToString(), datasetModel.CreatorNameIdentifier);
                        foreach (var chunkResult in chunkResults)
                        {
                            filesDict.Add(chunkResult.Key, chunkResult.Value);
                        }
                    }
                }
            }
        }
        catch (Exception)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }

        commandResult.Data = new DatasetCreationResult
        {
            DatasetId = datasetModel.Id.ToString(),
            FilesResult = filesDict
        };
        return commandResult;
    }

    public async Task<IList<ListDataset>> ListDatasetAsync(bool? locked, IList<string> groupIds)
    {
        IList<DatasetModel> datasets;
        if (locked.HasValue)
            datasets = await _datasetContext.Datasets.AsNoTracking()
                .Where(dataset => dataset.IsLocked == locked && groupIds.Contains(dataset.GroupId.ToString()))
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
                    IsLocked = dataset.IsLocked,
                    Classification = dataset.Classification
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
        if (dataset == null || dataset.IsLocked) return false;
        dataset.IsLocked = true;
        await _datasetContext.SaveChangesAsync();
        _cache.Remove($"GetDatasetInfoAsync({datasetId})");
        return true;
    }

    public async Task<ResultWithError<FileServiceDataModel, ErrorResult>> GetFileAsync(string datasetId, string fileId)
    {
        var result = new ResultWithError<FileServiceDataModel, ErrorResult>();
        var file = await _datasetContext.Files.AsNoTracking().FirstOrDefaultAsync(file =>
            file.Id == new Guid(fileId) && file.DatasetId == new Guid(datasetId));
        if (file == null)
        {
            result.Error = new ErrorResult
            {
                Key = FileNotFound
            };
            return result;
        }

        return await _fileService.DownloadAsync(datasetId, file.Name);
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
            var taskUploadBlob = _fileService.UploadStreamAsync(datasetId, fileName, stream);
            Task.WaitAll(taskSaveSql, taskUploadBlob);
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

    private async Task<Dictionary<string, string>> CreateFilesAsync(
        IList<KeyValuePair<string, ResultWithError<FileServiceDataModel, ErrorResult>>> chunk, string datasetId, string creatorNameIdentifier)
    {
        var resultsDict = new Dictionary<string, string>();
        var filteredChunk = new List<KeyValuePair<string, ResultWithError<FileServiceDataModel, ErrorResult>>>();
        foreach (var element in chunk)
        {
            var addResult = _datasetContext.Files.AddIfNotExists(new FileModel
            {
                Name = element.Key.Substring(element.Key.LastIndexOf("/", StringComparison.Ordinal) + 1),
                ContentType = element.Value.Data.ContentType,
                CreatorNameIdentifier = creatorNameIdentifier,
                CreateDate = DateTime.Now.Ticks,
                Size = element.Value.Data.Length,
                DatasetId = new Guid(datasetId)
            });
            if (addResult != null)
            {
                filteredChunk.Add(element);
            }
        }
        try
        {
            Parallel.ForEach(filteredChunk,
                async element =>
                {
                    var fileServiceDataModel = element.Value.Data;
                    var endpointFileName = element.Key.Substring(element.Key.LastIndexOf("/", StringComparison.Ordinal) + 1);
                    var memoryStream = new MemoryStream();
                    await fileServiceDataModel.Stream.CopyToAsync(memoryStream);
                    if (!FileValidator.IsFileSizeValid(memoryStream))
                    {
                        resultsDict.Add(element.Key, FileTooLarge);
                        return;
                    }
                    await _fileService.UploadStreamAsync(datasetId, endpointFileName, memoryStream);
                });
            await _datasetContext.SaveChangesAsync();
        }
        catch (Exception)
        {
            foreach (var file in chunk)
            {
                if (!resultsDict.ContainsKey(file.Key))
                {
                    resultsDict.Add(file.Key, UploadError);
                }
            }
        }

        return resultsDict;
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

        var taskDeleteSql = _datasetContext.SaveChangesAsync();
        var taskDeleteBob = _fileService.DeleteAsync(datasetId, file.Name);
        Task.WaitAll(taskDeleteSql, taskDeleteBob);
        result.Data = taskDeleteBob.Result;
        return result;
    }
}