using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Options;

namespace Ml.Cli.WebApp.Server.Audits.Database;

public class AuditSqliteContext : DbContext
{
    public AuditSqliteContext(IOptions<DatabaseSettings> optionsDatabaseSettings)
    {
    }

    public AuditSqliteContext(DbContextOptions<AuditContext> options) : base(options)
    {
    }

    public AuditSqliteContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<AuditModel> Audits { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var datasetBuilder = modelBuilder.Entity<AuditModel>();
        datasetBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
    }
}