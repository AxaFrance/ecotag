using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects;

[Route("api/server/[controller]")]
[ApiController]
[Authorize(Roles = Roles.DataAnnoteur)]
public class ProjectsController : Controller
{
    [HttpGet("{projectId}/files/{id}")]
    [ResponseCache(Duration = 1)]
    public async Task<IActionResult> GetProjectFile([FromServices] GetProjectFileCmd getProjectFileCmd,
        string projectId, string id)
    {
        var nameIdentifier = User.Identity.GetNameIdentifier();
        var result = await getProjectFileCmd.ExecuteAsync(projectId, id, nameIdentifier);

        if (!result.IsSuccess)
        {
            var errorKey = result.Error.Key;
            return errorKey switch
            {
                FileBlobService.FileNameMissing => NotFound(),
                GetProjectFileCmd.DatasetNotFound => NotFound(),
                DatasetsRepository.FileNotFound => NotFound(),
                ProjectsRepository.NotFound => NotFound(),
                _ => Forbid()
            };
        }

        var file = result.Data;
        return File(file.Stream, file.ContentType, file.Name);
    }

    [HttpGet("{id}/{datasetId}", Name = "GetProjectDatasetById")]
    [ResponseCache(Duration = 1)]
    public async Task<ActionResult<GetDataset>> GetDataset([FromServices] GetProjectDatasetCmd getprojectDatasetCmd,
        string id, string datasetId)
    {
        var nameIdentifier = User.Identity.GetNameIdentifier();
        var getDatasetResult = await getprojectDatasetCmd.ExecuteAsync(datasetId, id, nameIdentifier);

        if (!getDatasetResult.IsSuccess)
        {
            var errorKey = getDatasetResult.Error.Key;
            return errorKey switch
            {
                GetProjectDatasetCmd.DatasetNotFound => NotFound(),
                ProjectsRepository.NotFound => NotFound(),
                _ => Forbid()
            };
        }

        return Ok(getDatasetResult.Data);
    }

    [HttpGet]
    [ResponseCache(Duration = 1)]
    public async Task<ActionResult<IEnumerable<ProjectDataModel>>> GetAllProjects(
        [FromServices] GetAllProjectsCmd getAllProjectsCmd)
    {
        var nameIdentifier = User.Identity.GetNameIdentifier();
        var result = await getAllProjectsCmd.ExecuteAsync(nameIdentifier);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetProjectCmdResult>> GetProject([FromServices] GetProjectCmd getProjectCmd,
        string id)
    {
        var nameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await getProjectCmd.ExecuteAsync(id, nameIdentifier);
        if (!commandResult.IsSuccess)
            return commandResult.Error.Key == ProjectsRepository.Forbidden
                ? Forbid()
                : BadRequest(
                    commandResult.Error);

        return Ok(commandResult.Data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<string>> Create([FromServices] CreateProjectCmd createProjectCmd,
        CreateProjectInput createProjectInput)
    {
        var creatorNameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await createProjectCmd.ExecuteAsync(new CreateProjectWithUserInput
            { CreateProjectInput = createProjectInput, CreatorNameIdentifier = creatorNameIdentifier });
        if (!commandResult.IsSuccess) return BadRequest(commandResult.Error);

        return Created(commandResult.Data, commandResult.Data);
    }

    [HttpPost("delete/{projectId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Authorize(Roles = Roles.DataScientist)]
    public async Task<ActionResult> Delete([FromServices] ExportThenDeleteProjectCmd exportThenDeleteProjectCmd,
        string projectId)
    {
        var nameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await exportThenDeleteProjectCmd.ExecuteAsync(projectId, nameIdentifier);
        if (!commandResult.IsSuccess)
            return commandResult.Error.Key == ProjectsRepository.Forbidden
                ? Forbid()
                : BadRequest(commandResult.Error);

        return Ok();
    }

    [HttpPost("{projectId}/reserve")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IList<ReserveOutput>>> Reserve([FromServices] ReserveCmd reserveCmd,
        string projectId, ReserveInput fileInput)
    {
        var creatorNameIdentifier = User.Identity.GetNameIdentifier();
        var reservations = await reserveCmd.ExecuteAsync(projectId, fileInput.FileId, creatorNameIdentifier);

        if (!reservations.IsSuccess)
        {
            var errorKey = reservations.Error.Key;
            return errorKey switch
            {
                ProjectsRepository.NotFound => BadRequest(reservations.Error),
                _ => Forbid()
            };
        }

        return Ok(reservations.Data);
    }

    [HttpGet("{projectId}/export")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [Authorize(Roles = Roles.DataScientist)]
    public async Task<ActionResult<GetExportCmdResult>> Export([FromServices] ExportCmd exportCmd,
        string projectId)
    {
        var userNameIdentifier = User.Identity.GetNameIdentifier();
        var commandResult = await exportCmd.ExecuteAsync(projectId, userNameIdentifier);
        if (!commandResult.IsSuccess)
            return commandResult.Error.Key == ProjectsRepository.Forbidden
                ? Forbid()
                : BadRequest(commandResult.Error);

        return Ok(commandResult.Data);
    }
}