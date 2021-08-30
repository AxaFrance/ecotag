using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.SafeHandles;
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
        public async Task ShouldReturnFile()
        {
            var fileValue = "value=C:\\someFolderWith%2BSign\\{fileName}.png";
            
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.OpenRead("C:\\someFolderWith+Sign\\{fileName}.png"))
                .Returns(new MemoryStream());
            
            var filesController = new FilesController(fileLoader.Object, basePath.Object);

            var result = await filesController.ShowFile(fileValue) as FileStreamResult;
            Assert.Equal("image/png", result.ContentType);
        }
    }
}