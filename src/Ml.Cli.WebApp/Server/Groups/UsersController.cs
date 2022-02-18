using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Groups
{
    [Route("api/server/[controller]")]
    [ApiController]
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
}
