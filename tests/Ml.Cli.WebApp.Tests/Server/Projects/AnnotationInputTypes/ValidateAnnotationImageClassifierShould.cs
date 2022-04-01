using Ml.Cli.WebApp.Server.Projects.AnnotationInputValidators;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.AnnotationInputTypes;

public class ValidateAnnotationImageClassifierShould
{
    [Fact]
    public void ShouldValidateLabel()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "ImageClassifier";
        var jsonAnnotationImageClassifier = "{\"label\": \"someLabel\"}";
        Assert.True(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationImageClassifier, project, logger));
    }

    [Fact]
    public void ShouldInvalidateLabel()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "ImageClassifier";
        var jsonAnnotationImageClassifier = "{\"label\": \"wrongLabelName\"}";
        Assert.False(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationImageClassifier, project, logger));
    }
}