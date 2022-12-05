using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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
        var datasetBuilder = modelBuilder.Entity<AuditModel>();
        datasetBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
    }
}