using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Audits.Database;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class AuditContext : DbContext
{
    public AuditContext()
    {
    }

    public AuditContext(DbContextOptions<DatasetContext> options) : base(options)
    {
    }

    public AuditContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<AuditModel> Audits { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {


    }
}