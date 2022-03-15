using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetContext : DbContext
{
    public DatasetContext() { }

    public DatasetContext(DbContextOptions<DatasetContext> options) : base(options)
    {
    }

    public DatasetContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FileModel>()
            .HasOne(gu => gu.Dataset)
            .WithMany(u => u.Files)
            .HasForeignKey(gu => gu.DatasetId);
    }

    public virtual DbSet<DatasetModel> Datasets { get; set; }
    
    public virtual DbSet<FileModel> Files { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
    
}