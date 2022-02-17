using System;
using System.Collections.Generic;
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

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<GroupWithUsersDataModel>> GetGroup([FromServices]GetGroupCmd getGroupCmd, string id)
        {
            var commandResult = await getGroupCmd.ExecuteAsync(id);
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }

            return Ok(commandResult.Data);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Create([FromServices]CreateGroupCmd createGroupCmd, CreateGroupInput createGroupInput)
        {
            var commandResult = await createGroupCmd.ExecuteAsync(createGroupInput);
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }
            return Created(commandResult.Data, find(commandResult.Data));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<string>> Update([FromServices] UpdateGroupCmd updateGroupCmd, UpdateGroupInput updateGroupInput)
        {
            var commandResult = await updateGroupCmd.ExecuteAsync(updateGroupInput);
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }

            return Ok(commandResult.Data);
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
