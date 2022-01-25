using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using DatasetsController = Ml.Cli.WebApp.Server.Datasets.DatasetsController;

namespace Ml.Cli.WebApp.Server.Projects
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class ProjectsController : Controller
    {
        public static List<Project> projects;
        public static ProjectReservation ProjectReservation = new ProjectReservation();

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

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public ActionResult<IEnumerable<Project>> GetAllProjects()
        {
            return Ok(projects);
        }

        [HttpGet("{id}", Name = "GetProjectById")]
        public ActionResult<Project> GetProject(string id)
        {
            var project = Find(id);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Project> Create(Project newProject)
        {
            newProject.Id = Guid.NewGuid().ToString();
            newProject.CreateDate = DateTime.Now;
            projects.Add(newProject);
            
            return Created(newProject.Id, Find(newProject.Id));
        }
        
        [HttpPost("{projectId}/reserve")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<IList<ReserveOutput>> Reserve(string projectId)
        {
            var project = Find(projectId);

            var numberToReserve = 6;

            var dataset = DatasetsController.datasets.FirstOrDefault(dataset => dataset.Id == project.DataSetId);
            
            var query = from datasetFiles in dataset.Files
                join reserve in ProjectReservation.Reservations on datasetFiles.Id equals reserve.FileId into gj
                from reservation in gj.DefaultIfEmpty()
                orderby reservation?.TimeStamp ?? 0 descending 
                select new ReserveOutput{ FileId=datasetFiles.Id, FileName=datasetFiles.FileName, TimeStamp = reservation?.TimeStamp ?? 0 };

            var results = query.Take(numberToReserve).ToList();

            var ticks = DateTime.Now.Ticks;

            foreach (var result in results)
            {
                var reserve = ProjectReservation.Reservations.FirstOrDefault(reserve => reserve.FileId == result.FileId);
                if (reserve != null)
                {
                    ProjectReservation.Reservations.Add(new Reserve() { FileId = result.FileId, TimeStamp = ticks});
                }
                else
                {
                    reserve.TimeStamp = ticks;
                }
            }
            
            return Ok(results);
        }
        
        [HttpGet("{projectId}/files/{id}")]
        [ResponseCache(Duration = 1)]
        public IActionResult GetFile(string datasetId, string id)
        {

            var file = DatasetsController.files.FirstOrDefault(file => file.Id == id && file.DatasetId == datasetId);
            if (file != null) return File(file.Bytes, file.ContentType, file.FileName);

            return NotFound();
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
