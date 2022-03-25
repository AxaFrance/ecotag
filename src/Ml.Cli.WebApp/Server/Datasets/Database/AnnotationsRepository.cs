using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Projects;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class AnnotationsRepository
{
    private readonly DatasetContext _datasetsContext;

    public AnnotationsRepository(DatasetContext datasetsContext)
    {
        _datasetsContext = datasetsContext;
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
            var querySingle = query =
                _datasetsContext.Files.Where(f => f.DatasetId == new Guid(datasetId) && f.Id == new Guid(fileId)).Select(file =>
                    new
                    {
                        FileId = file.Id,
                        FileName = file.Name,
                        Reservation = file.Reservations.SingleOrDefault(r => r.ProjectId == new Guid(projectId)),
                        Annotation = file.Annotations.Where(a => a.ProjectId == new Guid(projectId) && a.CreatorNameIdentifier == creatorNameIdentifier)
                            .OrderBy(a => a.TimeStamp).Select(a => a).SingleOrDefault(),
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
