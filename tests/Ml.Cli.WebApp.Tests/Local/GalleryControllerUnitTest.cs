using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Local;
using Ml.Cli.WebApp.Local.Paths;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class GalleryControllerUnitTest
    {
        [Fact]
        public void ShouldGetFilesFromDirectory()
        {
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateFiles("C:\\github\\fork\\ml-cli\\demo\\licenses\\images"))
                .Returns(new[]{"birthdateFolder\\{someFileName}.pdf.png", "birthdateFolder\\{otherFilename}.pdf.png"});
            
            var galleryController = new GalleryController(fileLoader.Object, basePath.Object);

            var result =
                galleryController.GetFilesFromDirectory("QzpcZ2l0aHViXGZvcmtcbWwtY2xpXGRlbW9cbGljZW5zZXNcaW1hZ2Vz");
            
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            var value = okResult.Value;

            var listValue = (List<FilesHandler.FileInfo>)value;
            Assert.Equal(2, listValue.Count);
            Assert.Contains(listValue, item => item.File.Equals("birthdateFolder\\{someFileName}.pdf.png"));
            Assert.Contains(listValue, item => item.File.Equals("birthdateFolder\\{otherFilename}.pdf.png"));
        }
    }
}