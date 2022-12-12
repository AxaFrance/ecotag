using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Oidc;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations.AnnotationInputValidators;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AxaGuilDEv.Ecotag.Server.Projects;

[Route("api/server/[controller]")]
[ApiController]
[Authorize(Roles = Roles.DataAnnoteur)]
public class AnnotationsController : Controller
{
    [HttpGet("{projectId}")]
    public async Task<ActionResult<GetProjectCmdResult>> GetAnnotationsStatus(
        [FromServices] GetAnnotationsStatusCmd getAnnotationsStatusCmd, string projectId)
    {
        var nameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await getAnnotationsStatusCmd.ExecuteAsync(projectId, nameIdentifier);
        if (!commandResult.IsSuccess)
            return commandResult.Error.Key == ProjectsRepository.Forbidden
                ? Forbid()
                : BadRequest(
                    commandResult.Error);
        return Ok(commandResult.Data);
    }

    [HttpPost("{projectId}/{fileId}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Annotation([FromServices] SaveAnnotationCmd saveAnnotationCmd, string projectId,
        string fileId, AnnotationInput annotationInput)
    {
        var creatorNameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await saveAnnotationCmd.ExecuteAsync(new SaveAnnotationInput
        {
            ProjectId = projectId,
            FileId = fileId,
            AnnotationInput = annotationInput,
            CreatorNameIdentifier = creatorNameIdentifier
        });
        if (!commandResult.IsSuccess)
            return commandResult.Error.Key == ProjectsRepository.Forbidden
                ? Forbid()
                : BadRequest(commandResult.Error);

        return Created($"{projectId}/{fileId}/{commandResult.Data}", commandResult.Data);
    }

    [HttpPut("{projectId}/{fileId}/{annotationId}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> Annotation([FromServices] SaveAnnotationCmd saveAnnotationCmd, string projectId,
        string fileId, string annotationId, AnnotationInput annotationInput)
    {
        var creatorNameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await saveAnnotationCmd.ExecuteAsync(new SaveAnnotationInput
        {
            ProjectId = projectId,
            FileId = fileId,
            AnnotationId = annotationId,
            AnnotationInput = annotationInput,
            CreatorNameIdentifier = creatorNameIdentifier
        });
        if (!commandResult.IsSuccess)
            return commandResult.Error.Key == ProjectsRepository.Forbidden
                ? Forbid()
                : BadRequest(commandResult.Error);

        return NoContent();
    }
}