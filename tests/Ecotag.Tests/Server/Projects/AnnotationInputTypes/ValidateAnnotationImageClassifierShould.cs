using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Projects.AnnotationInputTypes;

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