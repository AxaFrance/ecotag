using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetContext : DbContext
{
    public DatasetContext()
    {
    }

    public DatasetContext(DbContextOptions<DatasetContext> options) : base(options)
    {
    }

    public DatasetContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<DatasetModel> Datasets { get; set; }

    public virtual DbSet<FileModel> Files { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FileModel>()
            .HasOne(gu => gu.Dataset)
            .WithMany(u => u.Files)
            .HasForeignKey(gu => gu.DatasetId);
    }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
}