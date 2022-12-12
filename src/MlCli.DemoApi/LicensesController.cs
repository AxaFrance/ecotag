using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AxaGuilDEv.MlCli.DemoApi
{
    [ApiController]
    [Route("[controller]")]
    public class LicensesController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IActionResult> OnPostUploadAsync([FromForm(Name = "file")] List<IFormFile> file,
            [FromServices] IFileLoader fileLoader)
        {
            var response = await fileLoader.LoadAsync("response.json");
            var location = new Uri($"{Request.Scheme}://{Request.Host}");
            var body = response.Replace("${api-url}", location.ToString());
            Thread.Sleep(4000);
            return Ok(body);
        }
        
        
        [HttpGet("version")]
        public IActionResult Version()
        {
            return Ok("1.0."+DateTime.Now.Minute);
        }
    }
}