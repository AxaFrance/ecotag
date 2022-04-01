using System.ComponentModel.DataAnnotations;
using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotation.AnnotationInputValidators;

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