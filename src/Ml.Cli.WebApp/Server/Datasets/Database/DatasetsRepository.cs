using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetsRepository {
    private readonly DatasetContext _datasetsContext;
    private readonly IFileService _fileService;
    private readonly IMemoryCache _cache;
    public const string AlreadyTakenName = "AlreadyTakenName";

    public DatasetsRepository(DatasetContext datasetsContext, IFileService fileService, IMemoryCache cache)
    {
        _datasetsContext = datasetsContext;
        _fileService = fileService;
        _cache = cache;
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var groupModel = new DatasetModel()
        {
            Name = createDataset.Name,
            Classification = createDataset.Classification.ToDatasetClassification(),
            Type = createDataset.Type.ToDatasetType(),
            CreateDate = DateTime.Now.Ticks,
            GroupId = Guid.Parse(createDataset.GroupId),
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier
        };
        var result = Groups.Database.Group.DbSetExtension.AddIfNotExists(_datasetsContext.Datasets, groupModel, group => group.Name == groupModel.Name);
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        try
        {
            await _datasetsContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        commandResult.Data = groupModel.Id.ToString();
        return commandResult;
    }
    
    public async Task<IList<ListDataset>> ListDatasetAsync(bool? locked, IList<string> groupIds)
    {
        IList<DatasetModel> datasets;
        if (locked.HasValue)
        {
            datasets = await _datasetsContext.Datasets.AsNoTracking().Where(dataset => dataset.IsLocked == locked && groupIds.Contains(dataset.GroupId.ToString())).Include(dataset => dataset.Files).ToListAsync();
        }
        else
        {
            datasets = await _datasetsContext.Datasets.AsNoTracking().Where(dataset => groupIds.Contains(dataset.GroupId.ToString())).Include(dataset => dataset.Files).ToListAsync();
        }
        return datasets.Select(d => d.ToListDatasetResult()).ToList();
    }
    
    public async Task<GetDataset> GetDatasetAsync(string datasetId)
    {
        var dataset = await _datasetsContext.Datasets.AsNoTracking()
            .Where(dataset => dataset.Id == new Guid(datasetId))
            .Include(dataset => dataset.Files)
            .FirstOrDefaultAsync();
        return dataset?.ToGetDataset();
    }
    
    public async Task<GetDatasetInfo> GetDatasetInfoAsync(string datasetId)
    {
        var dataset = await _cache.GetOrCreateAsync($"GetDatasetInfoAsync({datasetId})", async entry =>
        {
            var dataset = await _datasetsContext.Datasets.AsNoTracking()
                .Where(dataset => dataset.Id == new Guid(datasetId)).Select(dataset => new GetDatasetInfo
                {
                    Id = dataset.Id.ToString().ToLower(),
                    Name = dataset.Name,
                    GroupId = dataset.GroupId.ToString().ToLower(),
                    IsLocked = dataset.IsLocked,
                })
                .FirstOrDefaultAsync();
            entry.AbsoluteExpirationRelativeToNow =
                dataset == null ? TimeSpan.FromMilliseconds(1) : TimeSpan.FromHours(1);
            entry.SlidingExpiration = TimeSpan.FromMinutes(1);
            return dataset;
        });
        return dataset;
    }

    public async Task<bool> Lock(string datasetId)
    {
        var dataset = await _datasetsContext.Datasets.FirstOrDefaultAsync(dataset => dataset.Id == new Guid(datasetId));
        if (dataset == null || dataset.IsLocked) return false;
        dataset.IsLocked = true;
        await _datasetsContext.SaveChangesAsync();
        _cache.Remove($"GetDatasetInfoAsync({datasetId})");
        return true;
    }
    
    public async Task<ResultWithError<FileDataModel, ErrorResult>> GetFileAsync(string datasetId, string fileId)
    {
        var result = new ResultWithError<FileDataModel, ErrorResult>();
        var file = await _datasetsContext.Files.FirstOrDefaultAsync(file => file.Id == new Guid(fileId) && file.DatasetId == new Guid(datasetId));
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

    private const string FileNotFound = "FileNotFound";

    public async Task<string> CreateFileAsync(string datasetId, Stream stream, string fileName, string contentType, string creatorNameIdentifier)
    {
        var file = new FileModel()
        {
            Name = fileName,
            ContentType = contentType,
            CreatorNameIdentifier = creatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = stream.Length,
            DatasetId = new Guid(datasetId)
        };
        _datasetsContext.Files.Add(file);
        var taskSave = _datasetsContext.SaveChangesAsync();
        var taskUpload = _fileService.UploadStreamAsync(datasetId, fileName, stream);
        Task.WaitAll(taskSave, taskUpload);
        await stream.DisposeAsync();
        return file.Id.ToString();
    }

}