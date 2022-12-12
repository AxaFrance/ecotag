using System.Collections.Generic;
using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;

public record AnnotationDocumentOcr
{
    public IDictionary<string, string> Labels { get; set; }
}

public static class AnnotationDocumentOcrValidator
{
    public static bool Validate(IDictionary<string, string> labels, ProjectDataModel project)
    {
        foreach (var labelName in labels)
            if (project.Labels.Count(l => l.Name == labelName.Key) <= 0)
                return false;

        return true;
    }
}