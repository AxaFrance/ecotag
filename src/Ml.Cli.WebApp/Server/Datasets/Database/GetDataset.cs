using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public record DatasetInput
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Classification { get; set; }
    public string GroupId { get; set; }
    public string ImportedDatasetName { get; set; }
}

public record GetDataset
{
    public string Id { get; set; }
    public string GroupId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Classification { get; set; }
    public long CreateDate { get; set; }
    public IList<GetDatasetFile> Files { get; set; } = new List<GetDatasetFile>();
    public DatasetLockedEnumeration Locked { get; set; } = DatasetLockedEnumeration.None;
}

public record GetDatasetInfo
{
    public string Id { get; set; }
    public string GroupId { get; set; }
    public string Name { get; set; }

    public string Type { get; set; }
    public DatasetLockedEnumeration Locked { get; set; } = DatasetLockedEnumeration.None;
    public DatasetClassificationEnumeration Classification { get; set; }
    public string BlobUri { get; set; }
}