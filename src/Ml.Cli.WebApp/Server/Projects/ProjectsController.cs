using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Datasets;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects
{
    [Route("api/server/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.DataAnnoteur)]
    public class ProjectsController : Controller
    {
        public static ProjectReservation ProjectReservation = new ProjectReservation();
        public static ProjectAnnotations ProjectAnnotations = new ProjectAnnotations();
        
        [HttpGet("{projectId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        public async Task<IActionResult> GetProjectFile([FromServices] GetProjectFileCmd getProjectFileCmd, string projectId, string id)
        {
            var nameIdentifier = User.Identity.GetSubject();
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
        
        [HttpGet("{id}/{datasetId}", Name = "GetProjectDatasetById")]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<GetDataset>> GetDataset([FromServices] GetProjectDatasetCmd getprojectDatasetCmd, string id, string datasetId)
        {
            var nameIdentifier = User.Identity.GetSubject();
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
            var nameIdentifier = User.Identity.GetSubject();
            var result = await getAllProjectsCmd.ExecuteAsync(nameIdentifier);
            return Ok(result);
        }

        [HttpGet("{id}", Name = "GetProjectById")]
        public async Task<ActionResult<ProjectDataModel>> GetProject([FromServices] GetProjectCmd getProjectCmd, string id)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var commandResult = await getProjectCmd.ExecuteAsync(id, nameIdentifier);
            if (!commandResult.IsSuccess)
            {
                return commandResult.Error.Key == ProjectsRepository.Forbidden ? Forbid() : BadRequest(
                    commandResult.Error);
            }
            return Ok(commandResult.Data);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Create([FromServices] CreateProjectCmd createProjectCmd,
            CreateProjectInput createProjectInput)
        {
            var creatorNameIdentifier = User.Identity.GetSubject();
            var commandResult = await createProjectCmd.ExecuteAsync(new CreateProjectWithUserInput{CreateProjectInput = createProjectInput, CreatorNameIdentifier = creatorNameIdentifier});
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }

            return Created(commandResult.Data, commandResult.Data);
        }
        
        [HttpPost("{projectId}/annotations/{fileId}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult Annotation(string projectId, string fileId, AnnotationInput annotationInput)
        {
            var id = Guid.NewGuid().ToString();

            var annotation = new Annotation
                {Id = id, FileId = fileId, ProjectId = projectId, ExpectedOutput = annotationInput.ExpectedOutput};
            ProjectAnnotations.Annotations.Add(annotation);
            
            return Created($"{projectId}/annotations/{fileId}/{id}", annotation.Id);
        }
        
        [HttpPut("{projectId}/annotations/{fileId}/{annotationId}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult Annotation(string projectId, string fileId, string annotationId, AnnotationInput annotationInput)
        {
            var annotation = ProjectAnnotations.Annotations.FirstOrDefault(a => a.Id == annotationId);
            annotation.ExpectedOutput = annotationInput.ExpectedOutput;
            return Ok();
        }
        
        [HttpPost("{projectId}/reserve")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IList<ReserveOutput>>> Reserve([FromServices] ReserveCmd reserveCmd, string projectId, ReserveInput fileInput)
        {
           // var project = Find(projectId);
           var creatorNameIdentifier = User.Identity.GetSubject();
           var reservations = await reserveCmd.ExecuteAsync(projectId, fileInput.FileId, creatorNameIdentifier);

           return Ok(reservations.Data);

           /* var dataset = DatasetsController.datasets.FirstOrDefault(dataset => dataset.Id == project.DataSetId);
            
            var query = from datasetFiles in dataset.Files
                join reserve in ProjectReservation.Reservations on datasetFiles.Id equals reserve.FileId into gj
                from reservation in gj.DefaultIfEmpty()
                orderby reservation?.TimeStamp ?? 0 ascending 
                select new ReserveOutput { 
                    FileId=datasetFiles.Id, 
                    FileName=datasetFiles.FileName, 
                    TimeStamp = reservation?.TimeStamp ?? 0,
                    Annotation = new ReserveAnnotation() { 
                        ExpectedOutputJson = ProjectAnnotations.Annotations.Where(annotation => annotation.FileId == datasetFiles.Id && annotation.ProjectId == projectId).FirstOrDefault()?.ExpectedOutput,
                        Id = ProjectAnnotations.Annotations.Where(annotation => annotation.FileId == datasetFiles.Id && annotation.ProjectId == projectId).FirstOrDefault()?.Id
                    }
                };

            var results = query.Take(numberToReserve).ToList();

            if (fileInput.FileId != null)
            {
                var currentFile =  dataset.Files.Where(file => file.Id == fileInput.FileId).Select(file => new ReserveOutput()
                {
                    FileId = file.Id, FileName = file.FileName, TimeStamp = 0, Annotation = new ReserveAnnotation() { 
                        ExpectedOutputJson = ProjectAnnotations.Annotations.Where(annotation => annotation.FileId == file.Id && annotation.ProjectId == projectId).FirstOrDefault()?.ExpectedOutput,
                        Id = ProjectAnnotations.Annotations.Where(annotation => annotation.FileId == file.Id && annotation.ProjectId == projectId).FirstOrDefault()?.Id
                    }
                }).FirstOrDefault();
                results.Insert(0, currentFile);
            }
            
            foreach (var result in results)
            {
                var reserve = ProjectReservation.Reservations.FirstOrDefault(reserve => reserve.FileId == result.FileId);
                var ticks = DateTime.Now.Ticks;
                if (reserve == null)
                {
                    ProjectReservation.Reservations.Add(new Reserve() { FileId = result.FileId, TimeStamp = ticks });
                }
                else
                {
                    reserve.TimeStamp = ticks;
                }
            }
            return Ok(results);*/

           return Ok();
        }
        
    }
}
