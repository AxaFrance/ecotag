using System.Collections.Generic;
using System.Threading.Tasks;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Paths;
using Moq;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class FilesHandlerUnitTest
    {
        [Fact]
        public void ShouldGetJsonFiles()
        {
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateFiles("someFolder\\\\comparesFolder1"))
                .Returns(new[] {"file1.json", "file2.png", "file3.json"});
            fileLoader.Setup(mock => mock.EnumerateFiles("someFolder\\\\comparesFolder2"))
                .Returns(new[] {"file4.png", "file5.pdf"});
            
            var comparesPaths = new ComparesPaths("someFolder\\\\comparesFolder1,someFolder\\\\comparesFolder2");

            var result = FilesHandler.GetFilesFromPaths(comparesPaths.Paths, basePath.Object, fileLoader.Object);
            
            Assert.Equal(new List<string>(){"file1.json","file3.json"}, result);
        }
    }
}