using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class DeleteContext : DbContext
{
    public DeleteContext()
    {
    }

    public DeleteContext(DbContextOptions<DeleteContext> options) : base(options)
    {
    }

    public DeleteContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<ProjectModel> Projects { get; set; }
    
    public virtual DbSet<DatasetModel> Datasets { get; set; }

    public virtual DbSet<FileModel> Files { get; set; }
    
    public virtual DbSet<ReservationModel> Reservations { get; set; }
    
    public virtual DbSet<AnnotationModel> Annotations { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FileModel>()
            .HasOne(gu => gu.Dataset)
            .WithMany(u => u.Files)
            .HasForeignKey(gu => gu.DatasetId);

        modelBuilder.Entity<AnnotationModel>()
            .HasOne(gu => gu.File)
            .WithMany(u => u.Annotations)
            .HasForeignKey(gu => gu.FileId);

        modelBuilder.Entity<AnnotationModel>()
            .HasOne<ProjectModel>()
            .WithMany()
            .HasForeignKey(gu => gu.ProjectId);

        modelBuilder.Entity<ReservationModel>()
            .HasOne(gu => gu.File)
            .WithMany(u => u.Reservations)
            .HasForeignKey(gu => gu.FileId);

        modelBuilder.Entity<ReservationModel>()
            .HasOne<ProjectModel>()
            .WithMany()
            .HasForeignKey(gu => gu.ProjectId);

        modelBuilder.Entity<ProjectModel>()
            .HasOne<DatasetModel>()
            .WithMany()
            .HasForeignKey(gu => gu.DatasetId);
    }
}