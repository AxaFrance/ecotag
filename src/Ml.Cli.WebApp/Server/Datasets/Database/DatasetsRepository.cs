using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Projects;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetsRepository
{
    public const string AlreadyTakenName = "AlreadyTakenName";

    public const string FileNotFound = "FileNotFound";
    private readonly IMemoryCache _cache;
    private readonly DatasetContext _datasetsContext;
    private readonly IFileService _fileService;

    public DatasetsRepository(DatasetContext datasetsContext, IFileService fileService, IMemoryCache cache)
    {
        _datasetsContext = datasetsContext;
        _fileService = fileService;
        _cache = cache;
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var groupModel = new DatasetModel
        {
            Name = createDataset.Name,
            Classification = createDataset.Classification.ToDatasetClassification(),
            Type = createDataset.Type.ToDatasetType(),
            CreateDate = DateTime.Now.Ticks,
            GroupId = Guid.Parse(createDataset.GroupId),
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier
        };
        var result = _datasetsContext.Datasets.AddIfNotExists(groupModel, group => group.Name == groupModel.Name);
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
            datasets = await _datasetsContext.Datasets.AsNoTracking()
                .Where(dataset => dataset.IsLocked == locked && groupIds.Contains(dataset.GroupId.ToString()))
                .Include(dataset => dataset.Files).ToListAsync();
        else
            datasets = await _datasetsContext.Datasets.AsNoTracking()
                .Where(dataset => groupIds.Contains(dataset.GroupId.ToString())).Include(dataset => dataset.Files)
                .ToListAsync();
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
                    Type = dataset.Type.ToString(),
                    IsLocked = dataset.IsLocked
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
        var file = await _datasetsContext.Files.FirstOrDefaultAsync(file =>
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

    public async Task<ResultWithError<bool, ErrorResult>> DeleteFileAsync(string datasetId, string fileId)
    {
        var result = new ResultWithError<bool, ErrorResult>();
        var file = await _datasetsContext.Files.FirstOrDefaultAsync(file =>
            file.Id == new Guid(fileId) && file.DatasetId == new Guid(datasetId));
        if (file == null)
        {
            result.Error = new ErrorResult
            {
                Key = FileNotFound
            };
            return result;
        }

        _datasetsContext.Files.Remove(file);

        var taskDeleteSql = _datasetsContext.SaveChangesAsync();
        var taskDeleteBob = _fileService.DeleteAsync(datasetId, file.Name);
        Task.WaitAll(taskDeleteSql, taskDeleteBob);
        result.Data = taskDeleteBob.Result;
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
        var result = _datasetsContext.Files.AddIfNotExists(fileModel,
            group => group.Name == fileName);
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }

        try
        {
            var taskSaveSql = _datasetsContext.SaveChangesAsync();
            var taskUploadBlob = _fileService.UploadStreamAsync(datasetId, fileName, stream);
            Task.WaitAll(taskSaveSql, taskUploadBlob);
        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }

        await stream.DisposeAsync();

        commandResult.Data = fileModel.Id.ToString();
        return commandResult;
    }
    
    public async Task<IList<ReserveOutput>> ReserveAsync(string projectId, string datasetId, string fileId=null, int numberToReserve=6)
    {
        var query =
            _datasetsContext.Files.Where(f => f.DatasetId == new Guid(datasetId)).Select(file =>
                new
                {
                    FileId = file.Id,
                    FileName = file.Name,
                    Reservation = file.Reservations.Where(r => r.ProjectId == new Guid(projectId))
                        .Select(r => r).OrderByDescending(r => r.TimeStamp).SingleOrDefault(),
                    Annotation = file.Annotations.Where(a => a.ProjectId == new Guid(projectId))
                        .OrderByDescending(a => a.TimeStamp).Select(a => a).SingleOrDefault(),
                }
            ).OrderByDescending(a => a.Reservation.TimeStamp);
             

        var results = await query.Take(numberToReserve).ToListAsync();
        if (fileId != null)
        {
            var currentFile = await query.Where(f=> f.FileId == new Guid(fileId)).FirstOrDefaultAsync();
            results.Insert(0, currentFile);
        }
        
        foreach (var result in results)
        {
            var reservation = result.Reservation;
            var ticks = DateTime.Now.Ticks;
            if (reservation == null)
            {
                _datasetsContext.Reservations.Add(new ReservationModel() { FileId = result.FileId, TimeStamp = ticks, ProjectId = new Guid(projectId) });
            }
            else
            {
                reservation.TimeStamp = ticks;
            }
        }

        await _datasetsContext.SaveChangesAsync();
        return results.Select(r => new ReserveOutput()
        {
            Annotation = r.Annotation == null ? null: new ReserveAnnotation()
            {
                Id = r.Annotation.Id.ToString(),
                ExpectedOutputJson = r.Annotation.ExpectedOutput
            },
            FileId = r.FileId.ToString(),
            FileName = r.FileName,
            TimeStamp = r.Reservation?.TimeStamp ?? 0
        }).ToList();
    }
    
}