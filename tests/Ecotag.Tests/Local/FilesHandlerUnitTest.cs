using System.Collections.Generic;
using AxaGuilDEv.Ecotag.Local.Paths;
using AxaGuilDEv.MlCli.FileLoader;
using AxaGuilDEv.MlCli.PathManager;
using Moq;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Local
{
    public class FilesHandlerUnitTest
    {
        [Fact]
        public void ShouldGetJsonFiles()
        {
            var basePath = new Mock<BasePath>("");
            var firstFolder = PathAdapter.AdaptPathForCurrentOs("someFolder/comparesFolder1");
            var secondFolder = PathAdapter.AdaptPathForCurrentOs("someFolder/comparesFolder2");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateFiles(firstFolder))
                .Returns(new[] {"file1.json", "file2.png", "file3.json"});
            fileLoader.Setup(mock => mock.EnumerateFiles(secondFolder))
                .Returns(new[] {"file4.png", "file5.pdf"});
            
            var comparesPaths = new ComparesPaths(string.Concat(firstFolder, ',', secondFolder));

            var result = FilesHandler.GetFilesFromPaths(comparesPaths.Paths, basePath.Object, fileLoader.Object);
            
            Assert.Equal(new List<string>(){"file1.json","file3.json"}, result);
        }
    }
}