namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class AnnotationDataModel
{
    public string Id { get; set; }
    public string FileId { get; set; }
    public long TimeStamp { get; set; }
    public string ProjectId { get; set; }
    public string CreatorNameIdentifier { get; set; }
    public string ExpectedOutput { get; set; }
}