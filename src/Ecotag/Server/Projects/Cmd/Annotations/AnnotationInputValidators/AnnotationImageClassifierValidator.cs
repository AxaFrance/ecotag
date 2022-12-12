using System.Linq;
using AxaGuilDEv.Ecotag.Server.Projects.Database;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations.AnnotationInputValidators;

public record AnnotationImageClassifier
{
    public string Label { get; set; }
}

public static class AnnotationImageClassifierValidator
{
    public static bool Validate(AnnotationImageClassifier annotationImageClassifier, ProjectDataModel project)
    {
        return project.Labels.Any(element => element.Name == annotationImageClassifier.Label);
    }
}