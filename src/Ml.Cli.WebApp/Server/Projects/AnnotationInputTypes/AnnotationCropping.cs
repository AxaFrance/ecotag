using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;

public record AnnotationCropping
{
    public int Width { get; set; }
    public int Height { get; set; }
    public string Type { get; set; }
    public CroppingLabels Labels { get; set; }
}

public record CroppingLabels
{
    public List<BoundingBox> BoundingBoxes { get; set; }
}

public record BoundingBox
{
    public string Label { get; set; }
    public int Height { get; set; }
    public int Left { get; set; }
    public int Top { get; set; }
    public int Width { get; set; }
}