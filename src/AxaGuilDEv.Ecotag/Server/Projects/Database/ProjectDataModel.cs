using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class ProjectDataModel
{
    public string Id { get; set; }

    public string DatasetId { get; set; }

    public string GroupId { get; set; }

    public string Name { get; set; }

    public int NumberCrossAnnotation { get; set; }

    public long CreateDate { get; set; }

    public string AnnotationType { get; set; }

    public List<LabelDataModel> Labels { get; set; }

    public string CreatorNameIdentifier { get; set; }
}