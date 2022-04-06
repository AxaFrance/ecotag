using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class FileDataModel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public long Size { get; set; }
    public string ContentType { get; set; }
    public string CreatorNameIdentifier { get; set; }
    public long CreateDate { get; set; }
    public string DatasetId { get; set; }
    public IList<AnnotationDataModel> Annotations { get; set; }
    public IList<ReservationDataModel> Reservations { get; set; }
}