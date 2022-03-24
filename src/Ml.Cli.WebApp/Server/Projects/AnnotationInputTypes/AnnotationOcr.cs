using System.Collections.Generic;
using System.Reflection;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public record AnnotationOcr
{
    public int Width { get; set; }
    public int Height { get; set; }
    public string Type { get; set; }
    public object Labels { get; set; }

    public bool Validate(ProjectDataModel project)
    {
        var jObjectLabels = JObject.Parse(Labels.ToString() ?? string.Empty);
        foreach (var label in project.Labels)
        {
            if (jObjectLabels[label.Name] == null)
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
