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
        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        switch (enumType)
        {
            case AnnotationTypeEnumeration.Cropping:
                try
                {
                    var croppingLabels = JsonSerializer.Deserialize<AnnotationCropping>(ExpectedOutput, jsonOptions);
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
                return AnnotationImageClassifier.Validate(ExpectedOutput, project);
            case AnnotationTypeEnumeration.NamedEntity:
                try
                {
                    var namedEntityLabels = JsonSerializer.Deserialize<List<AnnotationNer>>(ExpectedOutput, jsonOptions);
                    if (namedEntityLabels != null)
                    {
                        if (!AnnotationNer.ValidateNerLabelsNames(namedEntityLabels, project)) return false;
                        if (!AnnotationNer.ValidateNerOverlap(namedEntityLabels)) return false;
                        foreach (var label in namedEntityLabels)
                        {
                            if (!label.Validate(project))
                            {
                                return false;
                            }
                        }

                        isValid = true;
                    }
                }
                catch
                {
                    // ignored
                }

                break;
            case AnnotationTypeEnumeration.Ocr:
                try
                {
                    var ocrLabels = JsonSerializer.Deserialize<AnnotationOcr>(ExpectedOutput, jsonOptions);
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
