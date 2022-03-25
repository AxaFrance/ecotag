using System.Collections.Generic;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.AnnotationInputTypes;

public class ValidateAnnotationOcrShould
{
    [Fact]
    public void ShouldValidateLabels()
    {
        var project = InitProjectData();
        var jsonAnnotationOcr =
            "{\"width\": 100, \"height\": 200, \"type\": \"png\", \"labels\": {\"someLabel\": \"dzkqzdqs\", \"otherLabel\": \"dzjqsd\"}}";
        var annotationInput = new AnnotationInput() { ExpectedOutput = jsonAnnotationOcr };
        Assert.True(annotationInput.ValidateExpectedOutput(project));
    }

    [Fact]
    public void ShouldInvalidateLabels()
    {
        var project = InitProjectData();
        var jsonAnnotationOcr =
            "{\"width\": 100, \"height\": 200, \"type\": \"png\", \"labels\": {\"wrongLabelName\": \"dzkqzdqs\", \"otherLabel\": \"dzjqsd\"}}";
        var annotationInput = new AnnotationInput() { ExpectedOutput = jsonAnnotationOcr };
        Assert.False(annotationInput.ValidateExpectedOutput(project));
    }

    public static ProjectDataModel InitProjectData()
    {
        var project = new ProjectDataModel()
        {
            AnnotationType = "Ocr",
            Labels = new List<LabelDataModel>()
            {
                new()
                {
                    Name = "someLabel"
                },
                new()
                {
                    Name = "otherLabel"
                }
            }
        };
        return project;
    }
}