using System;
using System.Collections.Generic;
using Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record AnnotationInput
{
    public string ExpectedOutput { get; set; }

    public static bool ValidateExpectedOutput(string annotationType, string expectedOutput)
    {
        var parseResult = Enum.TryParse(annotationType, out AnnotationTypeEnumeration enumType);
        if (!parseResult) return false;
        var isValid = false;
        switch (enumType)
        {
            case AnnotationTypeEnumeration.Cropping:
                var croppingLabels = JsonConvert.DeserializeObject<AnnotationCropping>(expectedOutput);
                break;
            case AnnotationTypeEnumeration.ImageClassifier:
                //We only have the value, no need to deserialize as it already is a string
                break;
            case AnnotationTypeEnumeration.NamedEntity:
                var namedEntityLabels = JsonConvert.DeserializeObject<List<AnnotationNer>>(expectedOutput);
                break;
            case AnnotationTypeEnumeration.Ocr:
                var ocrLabels = JsonConvert.DeserializeObject<AnnotationOcr>(expectedOutput);
                break;
        }

        return isValid;
    }
}
