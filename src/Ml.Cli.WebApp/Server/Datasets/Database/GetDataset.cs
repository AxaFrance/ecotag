using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public record DatasetInput
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Classification { get; set; }
    public string GroupId { get; set; }
}

public record GetDataset
{
    public string Id { get; set; }
    public string GroupId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Classification { get; set; }
    public long CreateDate { get; set; }
    public bool IsLocked { get; set; } = false;
    public IList<GetDatasetFile> Files { get; set; } = new List<GetDatasetFile>();
}

public record GetDatasetInfo
{
    public string Id { get; set; }
    public string GroupId { get; set; }
    public string Name { get; set; }

    public string Type { get; set; }
    public bool IsLocked { get; set; } = false;
}