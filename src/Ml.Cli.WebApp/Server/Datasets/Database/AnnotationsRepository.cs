using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

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
    private readonly IServiceProvider _serviceProvider;
    private readonly IMemoryCache _cache;

    public AnnotationsRepository(DatasetContext datasetsContext, IServiceProvider serviceProvider, IMemoryCache cache)
    {
        _datasetsContext = datasetsContext;
        _serviceProvider = serviceProvider;
        _cache = cache;
    }
    
    private async Task<int> NumberAnnotationsAsync(DatasetContext datasetContext, string projectId, int numberAnnotation=1)
    {
        var numberAnnotations = await datasetContext.Annotations.AsNoTracking()
            .Where(a => a.ProjectId == new Guid(projectId))
            .Select(ux => new { FileId=ux.File.Id, ux.CreatorNameIdentifier}).GroupBy(g => g.FileId)
            .Select(t => new {t.Key, Count= t.Select(o => o.CreatorNameIdentifier).Count()}). CountAsync(f => f.Count >= numberAnnotation);
        return  numberAnnotations;
    }
    
    public async Task<AnnotationStatus> AnnotationStatusAsync(string projectId, string datasetId, int numberAnnotation=1)
    {
        var cacheEntry = await _cache.GetOrCreateAsync($"CountFiles({datasetId})", async entry =>
        {
            var fileCount = _datasetsContext.Files.AsNoTracking().Where(f => f.DatasetId == new Guid(datasetId))
                .CountAsync();
            return fileCount;
        });
        
        using var scope = _serviceProvider.CreateScope();
        using var datasetContext2 = scope.ServiceProvider.GetService<DatasetContext>();
        
        var taskAnnotations =  _datasetsContext.Annotations.AsNoTracking()
            .Where(a => a.ProjectId == new Guid(projectId))
            .Select(ux => new { FileId=ux.File.Id, ux.CreatorNameIdentifier}).GroupBy(g => g.CreatorNameIdentifier)
            .Select(t => new NumberAnnotationsByUsers { NameIdentifier = t.Key, NumberAnnotations= t.Select(o => o.FileId).Count()}).ToListAsync();
        
        var taskNumberAnnotations = NumberAnnotationsAsync(datasetContext2, projectId, numberAnnotation);
       
        Task.WaitAll( taskAnnotations, taskNumberAnnotations);
        var numberAnnotationsDone = taskAnnotations.Result.Sum(r => r.NumberAnnotations);

        var numberFiles = cacheEntry.Result;
        var numberAnnotationsToDo = numberFiles * numberAnnotation;
        double percentageNumberAnnotationsDone = Convert.ToDouble(numberAnnotationsDone) / Convert.ToDouble(numberAnnotationsToDo) * 100;
        if (percentageNumberAnnotationsDone >= 100)
        {
            percentageNumberAnnotationsDone = 99;
        }
        var isAnnotationClosed = taskNumberAnnotations.Result >= numberAnnotationsToDo;
        var annotationStatus = new AnnotationStatus()
        {
            IsAnnotationClosed = isAnnotationClosed,
            NumberAnnotationsByUsers = taskAnnotations.Result,
            NumberAnnotationsDone = numberAnnotationsDone,
            NumberAnnotationsToDo = numberAnnotationsToDo,
            PercentageNumberAnnotationsDone = isAnnotationClosed ? 100 : (int)percentageNumberAnnotationsDone,
        };
       
        return annotationStatus ;
    }

    public async Task<IList<ReserveOutput>> ReserveAsync(string projectId, string datasetId, string creatorNameIdentifier, string fileId=null, int numberAnnotation=1, int numberToReserve=6)
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
