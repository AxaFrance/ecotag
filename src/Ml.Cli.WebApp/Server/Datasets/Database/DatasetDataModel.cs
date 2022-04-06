namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetDataModel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public DatasetTypeEnumeration Type { get; set; }
    public DatasetClassificationEnumeration Classification { get; set; }
    public string GroupId { get; set; }
    public string CreatorNameIdentifier { get; set; }
    public long CreateDate { get; set; }
    public bool IsLocked { get; set; }
}