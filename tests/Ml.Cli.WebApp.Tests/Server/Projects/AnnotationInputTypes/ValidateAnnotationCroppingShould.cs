using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotation.AnnotationInputValidators;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects.AnnotationInputTypes;

public class ValidateAnnotationCroppingShould
{
    [Fact]
    public void ShouldValidateLabels()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "Cropping";
        var jsonAnnotationCropping = "{\"width\": 4608, \"height\": 3456, \"type\": \"png\", \"labels\": {\"boundingBoxes\": [{\"label\":\"someLabel\",\"height\":1089,\"left\":1390,\"top\":485,\"width\":1613},{\"label\":\"otherLabel\",\"height\":695,\"left\":3148,\"top\":1928,\"width\":997}]}}";
        Assert.True(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationCropping, project, logger));
    }
    
    [Fact]
    public void ShouldInvalidateLabels_Wrong_Label_Name()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "Cropping";
        var jsonAnnotationCropping = "{\"width\": 4608, \"height\": 3456, \"type\": \"png\", \"labels\": {\"boundingBoxes\": [{\"label\":\"wrongLabelName\",\"height\":1089,\"left\":1390,\"top\":485,\"width\":1613},{\"label\":\"otherLabel\",\"height\":695,\"left\":3148,\"top\":1928,\"width\":997}]}}";
        Assert.False(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationCropping, project, logger));
    }
    
    [Fact]
    public void ShouldInvalidateLabels_Wrong_Size()
    {
        var (project, logger) = ValidateAnnotationOcrShould.InitProjectDataWithLogger();
        project.AnnotationType = "Cropping";
        var jsonAnnotationCropping = "{\"width\": 4608, \"height\": 3456, \"type\": \"png\", \"labels\": {\"boundingBoxes\": [{\"label\":\"wrongLabelName\",\"height\":1089,\"left\":1390,\"top\":485,\"width\":10000},{\"label\":\"otherLabel\",\"height\":695,\"left\":3148,\"top\":1928,\"width\":997}]}}";
        Assert.False(AnnotationInputValidator.ValidateExpectedOutput(jsonAnnotationCropping, project, logger));
    }
}