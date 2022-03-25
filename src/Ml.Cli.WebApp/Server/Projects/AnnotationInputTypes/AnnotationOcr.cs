using System.Collections.Generic;
using System.Reflection;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public record AnnotationOcr
{
    public int Width { get; set; }
    public int Height { get; set; }
    public string Type { get; set; }
    public IDictionary<string, string> Labels { get; set; }

    public bool Validate(ProjectDataModel project)
    {
        if (project.Labels.Count != Labels.Count) return false;
        foreach (var label in project.Labels)
        {
            if (!Labels.ContainsKey(label.Name))
            {
                return false;
            }
        }

        return true;
    }
    
    private static PropertyInfo[] GetProperties(object obj)
    {
        return obj.GetType().GetProperties();
    }
};
