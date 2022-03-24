using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public record AnnotationCropping
{
    [Range(0, int.MaxValue)]
    public int Width { get; set; }
    [Range(0, int.MaxValue)]
    public int Height { get; set; }
    public string Type { get; set; }
    public CroppingLabels Labels { get; set; }

    public bool Validate(ProjectDataModel project)
    {
        var validationResult = new Validation().Validate(this, true);
        if (!validationResult.IsSuccess) return false;
        var labelsList = Labels.BoundingBoxes;
        if (labelsList.Count != project.Labels.Count)
        {
            return false;
        }

        foreach (var label in labelsList)
        {
            if (project.Labels.All(element => element.Name != label.Label) || label.Left + label.Width > Width || label.Top + label.Height > Height)
            {
                return false;
            }
        }

        return true;
    }
}

public record CroppingLabels
{
    public List<BoundingBox> BoundingBoxes { get; set; }
}

public record BoundingBox
{
    public string Label { get; set; }
    [Range(0, int.MaxValue)]
    public int Height { get; set; }
    [Range(0, int.MaxValue)]
    public int Left { get; set; }
    [Range(0, int.MaxValue)]
    public int Top { get; set; }
    [Range(0, int.MaxValue)]
    public int Width { get; set; }
}