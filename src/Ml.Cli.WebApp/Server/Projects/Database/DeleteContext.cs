using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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
        var fileBuilder = modelBuilder.Entity<FileModel>();
        fileBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
        fileBuilder.Property(u => u.DatasetId).HasConversion(new GuidToStringConverter());
        fileBuilder
            .HasOne(gu => gu.Dataset)
            .WithMany(u => u.Files)
            .HasForeignKey(gu => gu.DatasetId);

        var annotationModelBuilder = modelBuilder.Entity<AnnotationModel>();
        annotationModelBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
        annotationModelBuilder.Property(u => u.FileId).HasConversion(new GuidToStringConverter());
        annotationModelBuilder.Property(u => u.ProjectId).HasConversion(new GuidToStringConverter());
        annotationModelBuilder
            .HasOne(gu => gu.File)
            .WithMany(u => u.Annotations)
            .HasForeignKey(gu => gu.FileId);

        annotationModelBuilder
            .HasOne<ProjectModel>()
            .WithMany()
            .HasForeignKey(gu => gu.ProjectId);

        var reservationModelBuilder = modelBuilder.Entity<ReservationModel>();
        reservationModelBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
        reservationModelBuilder.Property(u => u.FileId).HasConversion(new GuidToStringConverter());
        reservationModelBuilder.Property(u => u.ProjectId).HasConversion(new GuidToStringConverter());
        reservationModelBuilder
            .HasOne(gu => gu.File)
            .WithMany(u => u.Reservations)
            .HasForeignKey(gu => gu.FileId);

        reservationModelBuilder
            .HasOne<ProjectModel>()
            .WithMany()
            .HasForeignKey(gu => gu.ProjectId);

        var projectModelBuilder = modelBuilder.Entity<ProjectModel>();
        projectModelBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
        projectModelBuilder.Property(u => u.DatasetId).HasConversion(new GuidToStringConverter());
        projectModelBuilder.Property(u => u.GroupId).HasConversion(new GuidToStringConverter());
        projectModelBuilder
            .HasOne<DatasetModel>()
            .WithMany()
            .HasForeignKey(gu => gu.DatasetId);
        
    }
}