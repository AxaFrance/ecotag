namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class ListDataset
{
    public string Id { get; set; }
    public string GroupId { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Classification { get; set; }
    public int NumberFiles { get; set; }
    public long CreateDate { get; set; }
    public string BlobUri { get; set; }
    public DatasetLockedEnumeration Locked { get; set; } = DatasetLockedEnumeration.None;
}