using System;
using System.Collections.Generic;
using System.Text.Json;
using advalorem.Controllers.AF.AspNetCore.Authorization.Jwt.SiteMinder;
using Microsoft.AspNetCore.Mvc;
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
            var userMail = User.Identity.GetEmail();
            return Ok(users);
        }
    }
}
