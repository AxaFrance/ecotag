using System.ComponentModel.DataAnnotations;

namespace Ml.Cli.WebApp.Server.Projects.Cmd.Annotation.AnnotationInputValidators;

public record AnnotationRotation
{
    public int Height { get; set; }
    public int Width { get; set; }
    public bool ImageAnomaly { get; set; }
    public string Type { get; set; }
    public RotationLabel Labels { get; set; }
}

public record RotationLabel
{
    [Range(-179, 180, ErrorMessage = "Value must be between {1} and {2}")]
    public int Angle { get; set; }
}

public static class AnnotationRotationValidator
{
    public static bool Validate(AnnotationRotation annotationRotation)
    {
        var validationResult = new Validation().Validate(annotationRotation, true);
        return validationResult.IsSuccess;
    }
}
