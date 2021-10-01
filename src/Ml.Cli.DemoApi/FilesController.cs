using System.IO;
using Microsoft.AspNetCore.Mvc;

namespace Ml.Cli.DemoApi
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
            var response = fileLoader.LoadStream($"images{Path.PathSeparator}{directory}{Path.PathSeparator}license-specimen.pdf.png");

            return Ok(response);
        }
    }
}