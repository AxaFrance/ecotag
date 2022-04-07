namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class ReservationDataModel
{
    public string Id { get; set; }
    public string FileId { get; set; }
    public long TimeStamp { get; set; }
    public string ProjectId { get; set; }
}