using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Groups.Oidc;
using Ml.Cli.WebApp.Server.Oidc;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Groups
{
    [Route("api/server/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.DataAnnoteur)]
    public class UsersController : Controller
    {
        private static List<User> users;

        public UsersController()
        {
            if (users != null) return;
            Console.WriteLine("Loading users...");
            var usersAsString = System.IO.File.ReadAllText("./Server/Groups/mocks/users.json");
            var usersAsJsonFile = JsonDocument.Parse(usersAsString);
            var usersAsJson = usersAsJsonFile.RootElement.GetProperty("users");
            users = JsonConvert.DeserializeObject<List<User>>(usersAsJson.ToString());
        }

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers([FromServices] OidcUserInfoService oidcUserInfoService)
        {
            var accessToken = await HttpContext.GetTokenAsync("access_token");
            var useInfo = await oidcUserInfoService.GetUserEmailAsync(accessToken);
            return Ok(users);
        }
    }
}
