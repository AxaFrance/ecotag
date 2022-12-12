using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace AxaGuilDEv.MlCli.DemoApi
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {
        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] string id,
            [FromServices] IFileLoader fileLoader)
        {
            var directory = id.Replace(".png", "");
            var response = fileLoader.LoadStream($"images{Path.DirectorySeparatorChar}{directory}{Path.DirectorySeparatorChar}license-specimen.pdf.png");

            return File(response, "image/png");
        }
    }
}