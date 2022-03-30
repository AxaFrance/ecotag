using Ml.Cli.WebApp.Server.Projects.AnnotationInputValidators;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.AnnotationInputTypes;

public class ValidateAnnotationImageClassifierShould
{
    [Fact]
    public void ShouldValidateLabel()
    {
        var (project, _) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        var expectedOutput = "someLabel";
        Assert.True(AnnotationImageClassifierValidator.Validate(expectedOutput, project));
    }

    [Fact]
    public void ShouldInvalidateLabel()
    {
        var (project, _) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        var expectedOutput = "wrongLabelName";
        Assert.False(AnnotationImageClassifierValidator.Validate(expectedOutput, project));
    }
}