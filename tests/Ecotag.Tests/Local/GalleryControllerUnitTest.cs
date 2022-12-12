using System;
using System.Collections.Generic;
using System.Text;
using AxaGuilDEv.Ecotag.Local;
using AxaGuilDEv.Ecotag.Local.Paths;
using AxaGuilDEv.MlCli.FileLoader;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Local
{
    public class GalleryControllerUnitTest
    {
        [Fact]
        public void ShouldGetFilesFromDirectory()
        {
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var fileLoader = new Mock<IFileLoader>();
            var directory = "images";
            fileLoader.Setup(mock => mock.EnumerateFiles(directory))
                .Returns(new[]{"birthdateFolder\\{someFileName}.pdf.png", "birthdateFolder\\{otherFilename}.pdf.png"});
            
            var galleryController = new GalleryController(fileLoader.Object, basePath.Object);

            var toEncodeAsBytes = Encoding.ASCII.GetBytes(directory);
            var returnValue = Convert.ToBase64String(toEncodeAsBytes);
            var result =
                galleryController.GetFilesFromDirectory(returnValue);
            
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