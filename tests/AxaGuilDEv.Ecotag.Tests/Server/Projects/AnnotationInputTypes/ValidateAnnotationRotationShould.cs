using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.AnnotationInputTypes;

public class ValidateAnnotationRotationShould
{
    [Fact]
    public void ShouldValidateLabel()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "Rotation";
        var jsonAnnotationRotation = "{\"height\": 100, \"width\": 100, \"imageAnomaly\": false, \"type\": \"png\", \"labels\": {\"angle\": -179}}";
        Assert.True(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationRotation, project, logger));
    }

    [Fact]
    public void ShouldInvalidateLabel()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "Rotation";
        var jsonAnnotationRotation = "{\"height\": 100, \"width\": 100, \"imageAnomaly\": false, \"type\": \"png\", \"labels\": {\"angle\": -180}}";
        Assert.False(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationRotation, project, logger));
    }
}