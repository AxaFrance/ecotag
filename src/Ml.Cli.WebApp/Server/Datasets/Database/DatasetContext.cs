﻿using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;

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
    }
    
}