using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.AnnotationInputValidators;

public record AnnotationInput
{
    [Required]
    public string ExpectedOutput { get; set; }
}

public static class AnnotationInputValidator
{
    public static bool ValidateExpectedOutput(string expectedOutput, ProjectDataModel project, ILogger<SaveAnnotationCmd> logger)
    {
        var parseResult = Enum.TryParse(project.AnnotationType, out AnnotationTypeEnumeration enumType);
        if (!parseResult) return false;
        var isValid = false;
        switch (enumType)
        {
            case AnnotationTypeEnumeration.Cropping:
                var annotationCropping = DeserializeAnnotation<AnnotationCropping>(expectedOutput, logger);
                if (annotationCropping != null)
                {
                    isValid = AnnotationCroppingValidator.Validate(annotationCropping, project);
                }
                break;
            case AnnotationTypeEnumeration.ImageClassifier:
                var annotationImageClassifier =
                    DeserializeAnnotation<AnnotationImageClassifier>(expectedOutput, logger);
                return AnnotationImageClassifierValidator.Validate(annotationImageClassifier, project);
            case AnnotationTypeEnumeration.NamedEntity:
                var namedEntityLabels = DeserializeAnnotation<List<AnnotationNer>>(expectedOutput, logger);
                if (namedEntityLabels != null)
                {
                    if (!AnnotationNerValidator.ValidateNerLabelsNames(namedEntityLabels, project)) return false;
                    if (!AnnotationNerValidator.ValidateNerOverlap(namedEntityLabels)) return false;
                    foreach (var label in namedEntityLabels)
                    {
                        if (!AnnotationNerValidator.Validate(label, project))
                        {
                            return false;
                        }
                    }

                    isValid = true;
                }
                break;
            case AnnotationTypeEnumeration.Ocr:
                var annotationOcr = DeserializeAnnotation<AnnotationOcr>(expectedOutput, logger);
                if (annotationOcr != null)
                {
                    isValid = AnnotationOcrValidator.Validate(annotationOcr.Labels, project);
                }
                break;
        }

        return isValid;
    }

    private static T DeserializeAnnotation<T>(string expectedOutput, ILogger<SaveAnnotationCmd> logger) where T : class
    {
        try
        {
            return JsonSerializer.Deserialize<T>(expectedOutput,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch (Exception e)
        {
            logger.LogError("An error occured while deserializing annotation : " + e.Message);
            return null;
        }
    }
}