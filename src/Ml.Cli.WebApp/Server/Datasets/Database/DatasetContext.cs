using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetContext : DbContext
{
    public DatasetContext() { }

    public DatasetContext(DbContextOptions<GroupContext> options) : base(options)
    {
    }

    public DatasetContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        /*modelBuilder.Entity<GroupUsersModel>()
            .HasKey(gu => new { gu.GroupId, gu.UserId });
        modelBuilder.Entity<GroupUsersModel>()
            .HasOne(gu => gu.Group)
            .WithMany(g => g.GroupUsers)
            .HasForeignKey(gu => gu.GroupId);
        modelBuilder.Entity<GroupUsersModel>()
            .HasOne(gu => gu.User)
            .WithMany(u => u.GroupUsers)
            .HasForeignKey(gu => gu.UserId);*/
    }

    public virtual DbSet<DatasetModel> Datasets { get; set; }
    
    public virtual DbSet<FileModel> Files { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
    
}