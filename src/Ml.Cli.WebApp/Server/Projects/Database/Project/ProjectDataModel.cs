using System;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public class ProjectDataModel
{
    public string Id { get; set; }
    
    public string Name { get; set; }
    
    public string Classification { get; set; }
    
    public int NumberTagsToDo { get; set; }
    
    public DateTime CreateDate { get; set; }
    
    public string AnnotationType { get; set; }
    
    public string Text { get; set; }
    
    public string Labels { get; set; }
}