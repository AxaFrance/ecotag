using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Datasets.Database;

namespace Ml.Cli.WebApp.Server.Audits.Database;

public class AuditsRepository
{
    private readonly AuditContext _auditContext;

    public AuditsRepository(AuditContext auditContext)
    {
        _auditContext = auditContext;
    }
    
    public async Task<IList<Audit>> FindByElementIdAsync(
        string id, string type)
    {
       var audits = await _auditContext.Audits
            .Where(a => a.ElementId == new Guid(id) && a.Type == type)
            .OrderByDescending(a => a.CreateDate)
            .Select(a => new Audit()
            {
                Author = a.NameIdentifier,
                Diff = a.Diff,
                Id = a.Id.ToString(),
                Type = a.Type,
                CreateDate = a.CreateDate,
                ElementId = a.ElementId.ToString()
            }).ToListAsync();
        
        return audits;
    }

    public async Task SaveAsync(Audit element)
    {
        var auditModel = new AuditModel()
        {
            Diff = element.Diff,
            Type = element.Type,
            CreateDate = element.CreateDate,
            ElementId = new Guid(element.ElementId),
            NameIdentifier = element.Author
        };
        _auditContext.Add(auditModel);
        await _auditContext.SaveChangesAsync();
    }
}
