using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;

public record CroppingLabels
{
    public List<BoundingBox> BoundingBoxes { get; set; }
}

public record BoundingBox
{
    public string Label { get; set; }

    [Range(0, int.MaxValue)] public int Height { get; set; }

    [Range(0, int.MaxValue)] public int Left { get; set; }

    [Range(0, int.MaxValue)] public int Top { get; set; }

    [Range(0, int.MaxValue)] public int Width { get; set; }
}

public record AnnotationCropping
{
    [Range(0, int.MaxValue)] public int Width { get; set; }

    [Range(0, int.MaxValue)] public int Height { get; set; }

    public string Type { get; set; }
    public CroppingLabels Labels { get; set; }
}

public static class AnnotationCroppingValidator
{
    public static bool Validate(AnnotationCropping annotationCropping, ProjectDataModel project)
    {
        var validationResult = new Validation().Validate(annotationCropping, true);
        if (!validationResult.IsSuccess) return false;
        var labelsList = annotationCropping.Labels.BoundingBoxes;

        foreach (var label in labelsList)
            if (project.Labels.All(element => element.Name != label.Label) ||
                label.Left + label.Width > annotationCropping.Width ||
                label.Top + label.Height > annotationCropping.Height)
                return false;

        return true;
    }
}