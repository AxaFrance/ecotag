using System.Collections.Generic;
using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public record AnnotationNer
{
    public int Start { get; set; }
    public int End { get; set; }
    public string Token { get; set; }
    public AnnotationNerLabel Label { get; set; }

    public bool Validate(ProjectDataModel project)
    {
        if (Start >= End) return false;
        if (project.Labels.All(element => element.Name != Label.Name)) return false;
        return true;
    }
    
    public static bool ValidateNerOverlap(List<AnnotationNer> annotationNerList)
    {
        var sortedByStartValueList = annotationNerList.OrderBy(annotation => annotation.Start).ToList();
        for (var i = 0; i < sortedByStartValueList.Count - 1; i++)
        {
            for (var j = i + 1; j < sortedByStartValueList.Count; j++)
            {
                var firstAnnotation = sortedByStartValueList[i];
                var secondAnnotation = sortedByStartValueList[j];
                if (firstAnnotation.Start < secondAnnotation.End && firstAnnotation.End > secondAnnotation.Start)
                    return false;
            }
        }

        return true;
    }

    public static bool ValidateNerLabelsNames(List<AnnotationNer> annotationNerList, ProjectDataModel project)
    {
        var namesList = new List<string>();
        foreach (var annotation in annotationNerList.Where(annotation => !namesList.Contains(annotation.Label.Name)))
        {
            namesList.Add(annotation.Label.Name);
        }

        return namesList.All(element => project.Labels.Any(projectLabel => projectLabel.Name == element));
    }
}

public record AnnotationNerLabel
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Color { get; set; }
}