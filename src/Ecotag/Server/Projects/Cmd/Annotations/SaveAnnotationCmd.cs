﻿using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.Annotations;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
using Microsoft.Extensions.Logging;

namespace AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations;

public record SaveAnnotationInput
{
    public AnnotationInput AnnotationInput { get; set; }
    public string ProjectId { get; set; }
    public string AnnotationId { get; set; }
    public string FileId { get; set; }

    [MaxLength(64)] [MinLength(1)] public string CreatorNameIdentifier { get; set; }
}

public class SaveAnnotationCmd
{
    public const string InvalidModel = "InvalidModel";
    public const string UserNotFound = "UserNotFound";
    public const string InvalidLabels = "InvalidLabels";
    private readonly AnnotationsRepository _annotationsRepository;

    private readonly DatasetsRepository _datasetsRepository;
    private readonly ILogger<SaveAnnotationCmd> _logger;
    private readonly ProjectsRepository _projectsRepository;
    private readonly UsersRepository _usersRepository;

    public SaveAnnotationCmd(ProjectsRepository projectsRepository,
        UsersRepository usersRepository,
        DatasetsRepository datasetsRepository,
        AnnotationsRepository annotationsRepository,
        ILogger<SaveAnnotationCmd> logger)
    {
        _projectsRepository = projectsRepository;
        _usersRepository = usersRepository;
        _datasetsRepository = datasetsRepository;
        _annotationsRepository = annotationsRepository;
        _logger = logger;
    }

    public async Task<ResultWithError<string, ErrorResult>> ExecuteAsync(SaveAnnotationInput saveAnnotationInput)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();

        var validationResult = new Validation().Validate(saveAnnotationInput, true);
        if (!validationResult.IsSuccess)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidModel,
                Error = validationResult.Errors
            };
            return commandResult;
        }

        var user = await _usersRepository.GetUserByNameIdentifierWithGroupIdsAsync(saveAnnotationInput
            .CreatorNameIdentifier);
        if (user == null)
        {
            commandResult.Error = new ErrorResult
            {
                Key = UserNotFound,
                Error = null
            };
            return commandResult;
        }

        var project =
            await _projectsRepository.GetProjectAsync(saveAnnotationInput.ProjectId,
                user.GroupIds);
        if (!project.IsSuccess)
        {
            commandResult.Error = project.Error;
            return commandResult;
        }

        var file = await _datasetsRepository.GetFileAsync(project.Data.DatasetId, saveAnnotationInput.FileId);
        if (!file.IsSuccess)
        {
            commandResult.Error = file.Error;
            return commandResult;
        }

        var labelsValidationResult =
            AnnotationInputValidator.ValidateExpectedOutput(saveAnnotationInput.AnnotationInput.ExpectedOutput,
                project.Data, _logger);
        if (!labelsValidationResult)
        {
            commandResult.Error = new ErrorResult
            {
                Key = InvalidLabels,
                Error = null
            };
            return commandResult;
        }

        var annotation = await _annotationsRepository.CreateOrUpdateAnnotation(saveAnnotationInput);
        if (!annotation.IsSuccess)
        {
            commandResult.Error = annotation.Error;
            return commandResult;
        }

        return annotation;
    }
}