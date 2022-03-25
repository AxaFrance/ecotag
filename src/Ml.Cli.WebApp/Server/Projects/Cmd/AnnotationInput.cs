using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Ml.Cli.WebApp.Server.Projects.AnnotationInputTypes;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Projects.Cmd;

public record AnnotationInput
{
    [Required]
    public string ExpectedOutput { get; set; }

    public bool ValidateExpectedOutput(ProjectDataModel project)
    {
        var validationResult = new Validation().Validate(ExpectedOutput);
        if (!validationResult.IsSuccess) return false;
        var parseResult = Enum.TryParse(project.AnnotationType, out AnnotationTypeEnumeration enumType);
        if (!parseResult) return false;
        var isValid = false;
        switch (enumType)
        {
            case AnnotationTypeEnumeration.Cropping:
                try
                {
                    var croppingLabels = JsonConvert.DeserializeObject<AnnotationCropping>(ExpectedOutput);
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
                break;
            case AnnotationTypeEnumeration.NamedEntity:
                try
                {
                    var namedEntityLabels = JsonConvert.DeserializeObject<List<AnnotationNer>>(ExpectedOutput);
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
                    var ocrLabels = JsonConvert.DeserializeObject<AnnotationOcr>(ExpectedOutput);
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
