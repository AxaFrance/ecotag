using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class ProjectSqliteContext : DbContext
{
    public ProjectSqliteContext()
    {
    }

    public ProjectSqliteContext(DbContextOptions<ProjectContext> options) : base(options)
    {
    }

    public ProjectSqliteContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<ProjectModel> Projects { get; set; }
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var datasetBuilder = modelBuilder.Entity<ProjectModel>();
        datasetBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
        datasetBuilder.Property(u => u.GroupId).HasConversion(new GuidToStringConverter());
        datasetBuilder.Property(u => u.DatasetId).HasConversion(new GuidToStringConverter());
    }
}