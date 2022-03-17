using System;
using System.Linq;
using Ml.Cli.WebApp.Server.Datasets.Cmd;

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
            Files = datasetModel.Files.Select(file => new GetDatasetFile()
            {
                Id = file.Id.ToString(),
                ContentType = file.ContentType,
                Size = file.Size,
                FileName = file.Name,
            }).ToList()
        };
    }
    
    public static GetDatasetInfo ToGetDatasetInfo(this DatasetModel datasetModel)
    {
        return new GetDatasetInfo
        {
            Id = datasetModel.Id.ToString(),
            Name = datasetModel.Name,
            GroupId = datasetModel.GroupId.ToString(),
            IsLocked = datasetModel.IsLocked,
        };
    }

}