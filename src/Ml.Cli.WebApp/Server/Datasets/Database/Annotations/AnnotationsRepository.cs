using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;

namespace Ml.Cli.WebApp.Server.Datasets.Database.Annotations;

public record NumberAnnotationsByUsers
{
    public string NameIdentifier { get; set; }
    public int NumberAnnotations { get; set; }
}

public record AnnotationStatus
{
    public IList<NumberAnnotationsByUsers> NumberAnnotationsByUsers { get; set; }
    public bool IsAnnotationClosed { get; set; }
    public int NumberAnnotationsDone { get; set; }
    public int NumberAnnotationsToDo { get; set; }
    public int PercentageNumberAnnotationsDone { get; set; }
}

public class AnnotationsRepository
{
    private readonly DatasetContext _datasetsContext;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IMemoryCache _cache;
    public const string AnnotationNotFound = "AnnotationNotFound";

    public AnnotationsRepository(DatasetContext datasetsContext, IServiceScopeFactory serviceScopeFactory, IMemoryCache cache)
    {
        _datasetsContext = datasetsContext;
        _serviceScopeFactory = serviceScopeFactory;
        _cache = cache;
    }

    public async Task<AnnotationStatus> AnnotationStatusAsync(string projectId, string datasetId, int numberAnnotation=1)
    {
        var taskCacheEntry = _cache.GetOrCreateAsync($"CountFiles({datasetId})", async entry =>
        {
            var fileCount = _datasetsContext.Files.AsNoTracking().Where(f => f.DatasetId == new Guid(datasetId))
                .CountAsync();
            return fileCount;
        });
        
        var taskAnnotations = GetAnnotationsAsync(projectId);

        Task.WaitAll( taskAnnotations, taskCacheEntry);
        var numberAnnotationsDone = taskAnnotations.Result.Sum(r => r.NumberAnnotations);

        var numberFiles = taskCacheEntry.Result.Result;
        var numberAnnotationsToDo = numberFiles * numberAnnotation;
        double percentageNumberAnnotationsDone = Convert.ToDouble(numberAnnotationsDone) / Convert.ToDouble(numberAnnotationsToDo) * 100;
        if (percentageNumberAnnotationsDone >= 100)
        {
            percentageNumberAnnotationsDone = 99;
        }
        var isAnnotationClosed = numberAnnotationsDone >= numberAnnotationsToDo;
        var annotationStatus = new AnnotationStatus()
        {
            IsAnnotationClosed = isAnnotationClosed,
            NumberAnnotationsByUsers = taskAnnotations.Result,
            NumberAnnotationsDone = numberAnnotationsDone,
            NumberAnnotationsToDo = numberAnnotationsToDo,
            PercentageNumberAnnotationsDone = isAnnotationClosed ? 100 : (int)percentageNumberAnnotationsDone,
        };
       
        return annotationStatus;
    }

    private async Task<List<NumberAnnotationsByUsers>> GetAnnotationsAsync(string projectId)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        await using var datasetContext = scope.ServiceProvider.GetService<DatasetContext>();
        var annotations = await datasetContext.Annotations.AsNoTracking()
            .Where(a => a.ProjectId == new Guid(projectId))
            .Select(ux => new { FileId = ux.File.Id, ux.CreatorNameIdentifier }).GroupBy(g => g.CreatorNameIdentifier)
            .Select(t => new NumberAnnotationsByUsers
                { NameIdentifier = t.Key, NumberAnnotations = t.Select(o => o.FileId).Count() }).ToListAsync();
        return annotations;
    }

    public async Task<IList<ReserveOutput>> ReserveAsync(string projectId, string datasetId, string creatorNameIdentifier, string fileId=null, int numberAnnotation=1, int numberToReserve=10)
    {
        var query =
            _datasetsContext.Files.Where(f => f.DatasetId == new Guid(datasetId) 
                                              && f.Annotations.Count(a => a.ProjectId == new Guid(projectId)) < numberAnnotation
                                              && f.Annotations.Count(a => a.ProjectId == new Guid(projectId) && a.CreatorNameIdentifier == creatorNameIdentifier) == 0
                                              ).Select(file =>
                new
                {
                    FileId = file.Id,
                    FileName = file.Name,
                    Reservation = file.Reservations.SingleOrDefault(r => r.ProjectId == new Guid(projectId)),
                    Annotation = default(AnnotationModel),
                }
            ).OrderBy(a => a.Reservation.TimeStamp);
             

        var results = await query.Take(numberToReserve).ToListAsync();
        if (fileId != null)
        {
            var querySingle =
                _datasetsContext.Files.Where(f => f.DatasetId == new Guid(datasetId) && f.Id == new Guid(fileId)).Select(file =>
                    new
                    {
                        FileId = file.Id,
                        FileName = file.Name,
                        Reservation = file.Reservations.SingleOrDefault(r => r.ProjectId == new Guid(projectId)),
                        Annotation = file.Annotations.Where(a => a.ProjectId == new Guid(projectId) && a.CreatorNameIdentifier == creatorNameIdentifier)
                            .OrderBy(a => a.TimeStamp).Select(a => a).FirstOrDefault(),
                    }
                ).OrderBy(a => a.Reservation.TimeStamp);
            var currentFile = await querySingle.FirstOrDefaultAsync();
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
    
    
    public async Task<ResultWithError<string, ErrorResult>> CreateOrUpdateAnnotation(SaveAnnotationInput saveAnnotationInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        AnnotationModel annotation;
        if (saveAnnotationInput.AnnotationId == null)
        {
            annotation = new AnnotationModel()
            {
                FileId = new Guid(saveAnnotationInput.FileId),
                ProjectId = new Guid(saveAnnotationInput.ProjectId), 
                ExpectedOutput = saveAnnotationInput.AnnotationInput.ExpectedOutput,
                TimeStamp = DateTime.Now.Ticks,
                CreatorNameIdentifier = saveAnnotationInput.CreatorNameIdentifier
            };
            _datasetsContext.Annotations.Add(annotation);
        }
        else
        {
            annotation =  await _datasetsContext.Annotations.FirstOrDefaultAsync(a => a.Id == new Guid(saveAnnotationInput.AnnotationId));
            if (annotation == null)
            {
                commandResult.Error = new ErrorResult
                {
                    Key = AnnotationNotFound,
                    Error = null
                };
                return commandResult;
            }
            annotation.ExpectedOutput = saveAnnotationInput.AnnotationInput.ExpectedOutput;
        }
        await _datasetsContext.SaveChangesAsync();
        commandResult.Data = annotation.Id.ToString();
        return commandResult;
    }

    public async Task<IList<FileDataModel>> GetFilesWithAnnotationsByDatasetIdAsync(string datasetId)
    {
        var fileModels =  await _datasetsContext.Files.AsNoTracking()
            .Where(file => file.DatasetId == new Guid(datasetId))
            .Include(file => file.Annotations).ToListAsync();
        return fileModels.Select(fileModel => fileModel.ToFileDataModel()).ToList();
    }

    public async Task DeleteAnnotationsByProjectIdAsync(string projectId)
    {
        var annotations = await _datasetsContext.Annotations
            .Where(annotation => annotation.ProjectId.ToString().Equals(projectId)).ToListAsync();
        foreach (var annotation in annotations)
        {
            _datasetsContext.Annotations.Remove(annotation);
        }

        await _datasetsContext.SaveChangesAsync();
    }
}

public class ReserveAnnotation
{
    public string Id { get; set; }
    public string ExpectedOutputJson { get; set; }
}
public class ReserveOutput
{
    public string FileId{ get; set; }
    public string FileName{ get; set; }
    public long TimeStamp { get; set; }
       
    public ReserveAnnotation Annotation { get; set; }
}
