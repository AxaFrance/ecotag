using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Controllers;
using Ml.Cli.WebApp.Paths;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class FilesControllerUnitTest
    {
        [Fact]
        public async Task ShouldGetJsonFiles()
        {
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateFiles("someFolder\\\\comparesFolder1"))
                .Returns(new[] {"file1.json", "file2.png", "file3.json"});
            fileLoader.Setup(mock => mock.EnumerateFiles("someFolder\\\\comparesFolder2"))
                .Returns(new[] {"file4.png", "file5.pdf"});
            
            var filesPaths = new FilesPaths("someFolder\\\\comparesFolder1,someFolder\\\\comparesFolder2", "");
            
            var context = new Mock<HttpContext>();
            var request = new Mock<HttpRequest>();
            request.Setup(mock => mock.Headers).Returns(new HeaderDictionary {{"Referer", "https://localhost:5001/compare"}});
            context.Setup(mock => mock.Request).Returns(request.Object);
            
            var filesController = new FilesController(fileLoader.Object, basePath.Object, filesPaths)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = context.Object
                }
            };

            var result = await filesController.GetFiles() as ObjectResult;
            
            Assert.NotNull(result);
            Assert.Equal(new List<string>(){"file1.json","file3.json"}, result.Value);
        }
    }
}