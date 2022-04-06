using Microsoft.EntityFrameworkCore;

namespace Ml.Cli.WebApp.Server.Audits.Database;

public class AuditContext : DbContext
{
    public AuditContext()
    {
    }

    public AuditContext(DbContextOptions<AuditContext> options) : base(options)
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