using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Groups.Cmd;
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
            var groupsAsString = System.IO.File.ReadAllText("./Server/Groups/mocks/groups.json");
            if (groups != null) return;
            Console.WriteLine("Loading groups...");
            var groupsAsJsonFile = JsonDocument.Parse(groupsAsString);
            var groupsAsJson = groupsAsJsonFile.RootElement.GetProperty("groups");
            groups = JsonConvert.DeserializeObject<List<Group>>(groupsAsJson.ToString());
        }

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public ActionResult<IEnumerable<Group>> GetAllGroups()
        {
            return Ok(groups);
        }

        [HttpGet("{id}", Name = "GetGroupById")]
        [ResponseCache(Duration = 1)]
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
        public async Task<ActionResult<Group>> Create([FromServices]CreateGroupCmd createGroupCmd, CreateGroupInput createGroupInput)
        {
            var commandResult = await createGroupCmd.ExecuteAsync(createGroupInput);
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }
            return Created(commandResult.Data, find(commandResult.Data));
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
            return NoContent();
        }
    }
}
