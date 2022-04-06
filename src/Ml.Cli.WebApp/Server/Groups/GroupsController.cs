using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Microsoft.AspNetCore.Authorization;
using Ml.Cli.WebApp.Server.Oidc;

namespace Ml.Cli.WebApp.Server.Groups
{
    [Route("api/server/[controller]")]
    [ApiController]
    public class GroupsController : Controller
    {
        [HttpGet]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataScientist)]
        public async Task<ActionResult<IEnumerable<GroupDataModel>>> GetAllGroups([FromServices] GetAllGroupsCmd getAllGroupsCmd, [FromQuery]bool? mine=null)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var result = await getAllGroupsCmd.ExecuteAsync(mine, nameIdentifier);
            return Ok(result);
        }
        
        [HttpGet("{id}")]
        [ResponseCache(Duration = 1)]
        [Authorize(Roles = Roles.DataAnnoteur)]
        public async Task<ActionResult<GroupDataModel>> GetGroup([FromServices]GetGroupCmd getGroupCmd, string id)
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
        [Authorize(Roles = Roles.DataAdministateur)]
        public async Task<ActionResult<string>> Create([FromServices]CreateGroupCmd createGroupCmd, GroupInput groupInput)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var commandResult = await createGroupCmd.ExecuteAsync(new CreateGroupInput()
            {
                Name = groupInput.Name,
                UserIds = groupInput.UserIds,
                CreatorNameIdentifier = nameIdentifier
            });
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }
            
            return Created(commandResult.Data, commandResult.Data);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = Roles.DataAdministateur)]
        public async Task<ActionResult<string>> Update([FromServices] UpdateGroupCmd updateGroupCmd, UpdateGroupInput updateGroupInput)
        {
            var nameIdentifier = User.Identity.GetSubject();
            var commandResult = await updateGroupCmd.ExecuteAsync(updateGroupInput, nameIdentifier);
            if (!commandResult.IsSuccess)
            {
                return BadRequest(commandResult.Error);
            }

            return NoContent();
        }
    }
}
