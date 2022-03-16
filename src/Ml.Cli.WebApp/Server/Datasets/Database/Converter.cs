using System;
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

}