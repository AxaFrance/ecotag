using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Oidc;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database.Project;
using Newtonsoft.Json;
using DatasetsController = Ml.Cli.WebApp.Server.Datasets.DatasetsController;

namespace Ml.Cli.WebApp.Server.Projects
{
    [Route("api/server/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.DataAnnoteur)]
    public class ProjectsController : Controller
    {
        public static List<Project> projects;
        public static ProjectReservation ProjectReservation = new ProjectReservation();
        public static ProjectAnnotations ProjectAnnotations = new ProjectAnnotations();

        private Project Find(string id)
        {
            return projects.Find(currentProject => currentProject.Id.Equals(id));
        }

        public ProjectsController()
        {
            var projectsAsString = System.IO.File.ReadAllText("./Server/Projects/mocks/projects.json");
            if (projects != null) return;
            Console.WriteLine("Loading projects...");
            var projectsAsJsonnFile = JsonDocument.Parse(projectsAsString);
            var projectsAsJson = projectsAsJsonnFile.RootElement.GetProperty("projects");
            projects = JsonConvert.DeserializeObject<List<Project>>(projectsAsJson.ToString());
        }
        
        [HttpGet("{projectId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        public IActionResult GetProjectFile(string projectId, string id)
        {
            /*var project = Find(projectId);
            var dataset = DatasetsController.datasets.FirstOrDefault(dataset => dataset.Id == project.DataSetId);
            var file = DatasetsController.files.FirstOrDefault(file => file.Id == id && file.DatasetId == dataset.Id);
            if (file != null) return File(file.Bytes, file.ContentType, file.FileName);
            */
            return NotFound();
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
        public ActionResult<IList<ReserveOutput>> Reserve(string projectId, ReserveInput fileInput)
        {
            var project = Find(projectId);

            var numberToReserve = 6;

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
        

        [HttpDelete("{id}")]
        public ActionResult<Project> Delete(string id)
        {
            var project = Find(id);
            if (project == null)
            {
                return NotFound();
            }

            projects.Remove(project);
            return NoContent();
        }
    }
}
