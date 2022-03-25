using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public static class AnnotationImageClassifier
{
    public static bool Validate(string label, ProjectDataModel project)
    {
        return project.Labels.Any(element => element.Name == label);
    }
}