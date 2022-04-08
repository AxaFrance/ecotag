using System;
using System.Collections.Generic;
using System.Linq;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public static class Converter
{
    public static ListDataset ToListDatasetResult(this DatasetModel groupModel)
    {
        return new ListDataset
        {
            Id = groupModel.Id.ToString(),
            Name = groupModel.Name,
            Classification = groupModel.Classification.ToString(),
            Type = groupModel.Type.ToString(),
            CreateDate = groupModel.CreateDate,
            GroupId = groupModel.GroupId.ToString(),
            IsLocked = groupModel.IsLocked,
            NumberFiles = groupModel.Files.Count
        };
    }

    public static DatasetTypeEnumeration ToDatasetType(this string type)
    {
        return (DatasetTypeEnumeration)Enum.Parse(typeof(DatasetTypeEnumeration), type);
    }

    public static DatasetClassificationEnumeration ToDatasetClassification(this string type)
    {
        return (DatasetClassificationEnumeration)Enum.Parse(typeof(DatasetClassificationEnumeration), type);
    }

    public static GetDataset ToGetDataset(this DatasetModel datasetModel)
    {
        return new GetDataset
        {
            Id = datasetModel.Id.ToString(),
            Name = datasetModel.Name,
            Classification = datasetModel.Classification.ToString(),
            Type = datasetModel.Type.ToString(),
            CreateDate = datasetModel.CreateDate,
            GroupId = datasetModel.GroupId.ToString(),
            IsLocked = datasetModel.IsLocked,
            Files = datasetModel.Files.Select(file => new GetDatasetFile
            {
                Id = file.Id.ToString(),
                ContentType = file.ContentType,
                Size = file.Size,
                FileName = file.Name
            }).ToList()
        };
    }

    public static FileDataModel ToFileDataModel(this FileModel fileModel)
    {
        return new FileDataModel
        {
            Id = fileModel.Id.ToString(),
            Name = fileModel.Name,
            Size = fileModel.Size,
            ContentType = fileModel.ContentType,
            CreateDate = fileModel.CreateDate,
            DatasetId = fileModel.DatasetId.ToString(),
            CreatorNameIdentifier = fileModel.CreatorNameIdentifier,
            Annotations = fileModel.Annotations == null ? new List<AnnotationDataModel>() : fileModel.Annotations.Select(annotation => new AnnotationDataModel
            {
                Id = annotation.Id.ToString(),
                FileId = annotation.FileId.ToString(),
                ProjectId = annotation.ProjectId.ToString(),
                ExpectedOutput = annotation.ExpectedOutput,
                TimeStamp = annotation.TimeStamp,
                CreatorNameIdentifier = annotation.CreatorNameIdentifier
            }).ToList(),
            Reservations = fileModel.Reservations == null ? new List<ReservationDataModel>() : fileModel.Reservations.Select(reservation => new ReservationDataModel
            {
                Id = reservation.Id.ToString(),
                FileId = reservation.FileId.ToString(),
                ProjectId = reservation.ProjectId.ToString(),
                TimeStamp = reservation.TimeStamp
            }).ToList()
        };
    }
}