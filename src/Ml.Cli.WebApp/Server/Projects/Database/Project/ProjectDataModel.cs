using System;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public class ProjectDataModel
{
    public string Id { get; set; }
    
    public string DatasetId { get; set; }
    
    public string GroupId { get; set; }
    
    public string Name { get; set; }

    public int NumberCrossAnnotation { get; set; }
    
    public DateTime CreateDate { get; set; }
    
    public string AnnotationType { get; set; }

    public string LabelsJson { get; set; }
}