using System.Collections.Generic;
using System.Linq;
using AxaGuilDEv.Ecotag.Server.Projects.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations.AnnotationInputValidators;

public record AnnotationOcr
{
    public int Width { get; set; }
    public int Height { get; set; }
    public string Type { get; set; }
    public IDictionary<string, string> Labels { get; set; }
}

public static class AnnotationOcrValidator
{
    public static bool Validate(IDictionary<string, string> labels, ProjectDataModel project)
    {
        foreach (var labelName in labels)
            if (project.Labels.Count(l => l.Name == labelName.Key) <= 0)
                return false;

        return true;
    }
}