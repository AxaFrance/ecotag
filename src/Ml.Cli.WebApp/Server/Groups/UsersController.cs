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
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            return Ok(users);
        }

        [HttpGet]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers([FromServices] GetAllUsersCmd getAllUsersCmd)
        {
            var result = await getAllUsersCmd.ExecuteAsync();
            return Ok(result);
        }
    }
}
