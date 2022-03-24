using System;
using System.Collections.Generic;
using Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record AnnotationInput
{
    public string ExpectedOutput { get; set; }

    public static bool ValidateExpectedOutput(ProjectDataModel project, string expectedOutput)
    {
        var parseResult = Enum.TryParse(project.AnnotationType, out AnnotationTypeEnumeration enumType);
        if (!parseResult) return false;
        var isValid = false;
        switch (enumType)
        {
            case AnnotationTypeEnumeration.Cropping:
                try
                {
                    var croppingLabels = JsonConvert.DeserializeObject<AnnotationCropping>(expectedOutput);
                    if (croppingLabels != null)
                    {
                        isValid = croppingLabels.Validate(project);
                    }
                }
                catch
                {
                    // ignored
                }

                break;
            case AnnotationTypeEnumeration.ImageClassifier:
                //We only have the value, no need to deserialize as it already is a string
                break;
            case AnnotationTypeEnumeration.NamedEntity:
                var namedEntityLabels = JsonConvert.DeserializeObject<List<AnnotationNer>>(expectedOutput);
                break;
            case AnnotationTypeEnumeration.Ocr:
                try
                {
                    var ocrLabels = JsonConvert.DeserializeObject<AnnotationOcr>(expectedOutput);
                    if (ocrLabels != null)
                    {
                        isValid = ocrLabels.Validate(project);
                    }
                }
                catch
                {
                    // ignored
                }
                break;
        }

        return isValid;
    }
}
