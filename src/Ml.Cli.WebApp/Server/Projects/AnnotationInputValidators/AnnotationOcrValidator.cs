using System.Collections.Generic;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputValidators;

public record AnnotationOcr
{
    public int Width { get; set; }
    public int Height { get; set; }
    public string Type { get; set; }
    public IDictionary<string, string> Labels { get; set; }
};

public static class AnnotationOcrValidator
{
    public static bool Validate(IDictionary<string, string> labels, ProjectDataModel project)
    {
        if (project.Labels.Count != labels.Count) return false;
        foreach (var label in project.Labels)
        {
            if (!labels.ContainsKey(label.Name))
            {
                return false;
            }
        }

        return true;
    }
}