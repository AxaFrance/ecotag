using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Groups.Cmd;

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

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<IEnumerable<GroupWithUsersDataModel>>> GetAllGroups([FromServices] GetAllGroupsCmd getAllGroupsCmd)
        {
            var result = await getAllGroupsCmd.ExecuteAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
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
        public async Task<ActionResult<string>> Create([FromServices]CreateGroupCmd createGroupCmd, [FromServices]GetGroupCmd getGroupCmd, CreateGroupInput createGroupInput)
        {
            var commandResult = await createGroupCmd.ExecuteAsync(createGroupInput);
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }

            var groupData = await getGroupCmd.ExecuteAsync(commandResult.Data);
            return Created(commandResult.Data, groupData);
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
    }
}
