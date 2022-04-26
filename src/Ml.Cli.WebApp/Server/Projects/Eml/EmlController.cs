using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects.Eml
{
    [Route("api/server/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.DataAnnoteur)]
    public class EmlsController : Controller
    {
        [HttpGet("{projectId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        public async Task<IActionResult> GetProjectFile([FromServices] GetEmlCmd getProjectFileCmd, string projectId, string id)
        {
            var nameIdentifier = User.Identity.GetNameIdentifier();
            var result = await getProjectFileCmd.ExecuteAsync(projectId, id, nameIdentifier);

            if (!result.IsSuccess)
            {
                var errorKey = result.Error.Key;
                return errorKey switch
                {
                    FileService.FileNameMissing => NotFound(),
                    GetProjectFileCmd.DatasetNotFound => NotFound(),
                    DatasetsRepository.FileNotFound => NotFound(),
                    ProjectsRepository.NotFound => NotFound(),
                    _ => Forbid()
                };
            }

            var file = result.Data;
            return File(file.Stream, file.ContentType, file.Name);
        }
    }
}
