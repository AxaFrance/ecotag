using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Groups
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class GroupsController : Controller
    {
        private static List<Group> groups;

        private Group find(string id)
        {
            return groups.Find(currentGroup => currentGroup.Id == id);
        }

        public GroupsController()
        {
            string groupsAsString = System.IO.File.ReadAllText("./Server/Groups/mocks/groups.json");
            if (groups == null)
            {
                Console.WriteLine("Loading groups...");
                var groupsAsJsonFile = JsonDocument.Parse(groupsAsString);
                var groupsAsJson = groupsAsJsonFile.RootElement.GetProperty("groups");
                groups = JsonConvert.DeserializeObject<List<Group>>(groupsAsJson.ToString());
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<Group>> GetAllGroups()
        {
            return Ok(groups);
        }

        [HttpGet("{id}", Name = "GetGroupById")]
        public ActionResult<Group> GetGroup(string id)
        {
            var group = find(id);
            if (group == null)
            {
                return NotFound();
            }
            return Ok(group);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult<Group> Create(Group newGroup)
        {
            if (String.IsNullOrEmpty(newGroup.Id))
            {
                newGroup.Id = Guid.NewGuid().ToString();
                newGroup.Users = newGroup.Users?.Count > 0 ? newGroup.Users : new List<User>();
                groups.Add(newGroup);
            }
            else
            {
                var idx = groups.IndexOf(newGroup);
                groups[idx].Users = newGroup.Users?.Count > 0 ? newGroup.Users : new List<User>();

            }
            return find(newGroup.Id);
        }

        [HttpDelete("{id}")]
        public ActionResult<Group> Delete(string id)
        {
            var group = find(id);
            if (group == null)
            {
                return NotFound();
            }

            groups.Remove(group);
            return this.NoContent();
        }
    }
}
