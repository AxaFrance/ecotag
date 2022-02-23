using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class GroupsController : Controller
    {
        [HttpGet]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<IEnumerable<GroupDataModel>>> GetAllGroups([FromServices] GetAllGroupsCmd getAllGroupsCmd)
        {
            var result = await getAllGroupsCmd.ExecuteAsync();
            return Ok(result);
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
            
            return Created(commandResult.Data, commandResult.Data);
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

            return NoContent();
        }
    }
}
