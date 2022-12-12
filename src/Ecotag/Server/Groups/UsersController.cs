using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Server.Oidc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AxaGuilDEv.Ecotag.Server.Groups;

[Route("api/server/[controller]")]
[ApiController]
[Authorize(Roles = Roles.DataAnnoteur)]
public class UsersController : Controller
{
    [HttpGet]
    [ResponseCache(Duration = 1)]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers([FromServices] GetAllUsersCmd getAllUsersCmd)
    {
        var result = await getAllUsersCmd.ExecuteAsync();
        return Ok(result);
    }
}