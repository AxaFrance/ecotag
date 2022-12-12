using AxaGuilDEv.Ecotag.Server.Datasets.Database.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace AxaGuilDEv.Ecotag.Server.Datasets.Database;

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

    public virtual DbSet<ReservationModel> Reservations { get; set; }

    public virtual DbSet<AnnotationModel> Annotations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var datasetBuilder = modelBuilder.Entity<DatasetModel>();

        var fileBuilder = modelBuilder.Entity<FileModel>();
        fileBuilder
            .HasOne(gu => gu.Dataset)
            .WithMany(u => u.Files)
            .HasForeignKey(gu => gu.DatasetId);

        var annotationBuilder = modelBuilder.Entity<AnnotationModel>();
        annotationBuilder
            .HasOne(gu => gu.File)
            .WithMany(u => u.Annotations)
            .HasForeignKey(gu => gu.FileId);

        var reservationBuilder = modelBuilder.Entity<ReservationModel>();
        reservationBuilder
            .HasOne(gu => gu.File)
            .WithMany(u => u.Reservations)
            .HasForeignKey(gu => gu.FileId);


        if (Database.IsSqlite())
        {
            datasetBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
            datasetBuilder.Property(u => u.GroupId).HasConversion(new GuidToStringConverter());

            fileBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
            fileBuilder.Property(u => u.DatasetId).HasConversion(new GuidToStringConverter());

            annotationBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
            annotationBuilder.Property(u => u.FileId).HasConversion(new GuidToStringConverter());
            annotationBuilder.Property(u => u.ProjectId).HasConversion(new GuidToStringConverter());

            reservationBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());
            reservationBuilder.Property(u => u.FileId).HasConversion(new GuidToStringConverter());
            reservationBuilder.Property(u => u.ProjectId).HasConversion(new GuidToStringConverter());
        }
    }
}