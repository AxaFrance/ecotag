using System.Collections.Generic;
using Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;
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
        var annotationOcr = JsonConvert.DeserializeObject<AnnotationOcr>(jsonAnnotationOcr);
        Assert.True(annotationOcr?.Validate(project));
    }

    [Fact]
    public void ShouldInvalidateLabels()
    {
        var project = InitProjectData();
        var jsonAnnotationOcr =
            "{\"width\": 100, \"height\": 200, \"type\": \"png\", \"labels\": {\"wrongLabelName\": \"dzkqzdqs\", \"otherLabel\": \"dzjqsd\"}}";
        var annotationOcr = JsonConvert.DeserializeObject<AnnotationOcr>(jsonAnnotationOcr);
        Assert.False(annotationOcr?.Validate(project));
    }

    public static ProjectDataModel InitProjectData()
    {
        var project = new ProjectDataModel()
        {
            Labels = new List<LabelDataModel>()
            {
                new LabelDataModel()
                {
                    Name = "someLabel"
                },
                new LabelDataModel()
                {
                    Name = "otherLabel"
                }
            }
        };
        return project;
    }
}