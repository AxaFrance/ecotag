using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record AnnotationInput
{
    [Required]
    public string ExpectedOutput { get; set; }

    public bool ValidateExpectedOutput(ProjectDataModel project)
    {
        var parseResult = Enum.TryParse(project.AnnotationType, out AnnotationTypeEnumeration enumType);
        if (!parseResult) return false;
        var isValid = false;
        switch (enumType)
        {
            case AnnotationTypeEnumeration.Cropping:
                var annotationCropping = DeserializeAnnotation<AnnotationCropping>(ExpectedOutput);
                if (annotationCropping != null)
                {
                    isValid = AnnotationCropping.Validate(annotationCropping, project);
                }
                break;
            case AnnotationTypeEnumeration.ImageClassifier:
                //We only have the value, no need to deserialize as it already is a string
                return AnnotationImageClassifier.Validate(ExpectedOutput, project);
            case AnnotationTypeEnumeration.NamedEntity:
                var namedEntityLabels = DeserializeAnnotation<List<AnnotationNer>>(ExpectedOutput);
                if (namedEntityLabels != null)
                {
                    if (!AnnotationNer.ValidateNerLabelsNames(namedEntityLabels, project)) return false;
                    if (!AnnotationNer.ValidateNerOverlap(namedEntityLabels)) return false;
                    foreach (var label in namedEntityLabels)
                    {
                        if (!AnnotationNer.Validate(label, project))
                        {
                            return false;
                        }
                    }

                    isValid = true;
                }
                break;
            case AnnotationTypeEnumeration.Ocr:
                var annotationOcr = DeserializeAnnotation<AnnotationOcr>(ExpectedOutput);
                if (annotationOcr != null)
                {
                    isValid = AnnotationOcr.Validate(annotationOcr.Labels, project);
                }
                break;
        }

        return isValid;
    }

    private static T DeserializeAnnotation<T>(string expectedOutput) where T : class
    {
        try
        {
            return JsonSerializer.Deserialize<T>(expectedOutput,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (Exception e)
        {
            return null;
        }
    }
}
