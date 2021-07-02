using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.BasePath;
using Ml.Cli.WebApp.Controllers;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class DatasetsControllerUnitTest
    {
        [Fact]
        public async Task ShouldGetMatchingFiles()
        {
            var urlContent =
                "fileName={someFileName}_pdf.json&stringsMatcher=firstname, lastname&directory=someDirectory";
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.EnumerateDirectories(It.IsAny<string>()))
                .Returns(new[]{"birthdateFolder", "firstnameFolder", "lastnameFolder"});
            
            fileLoader.Setup(foo => foo.EnumerateFiles("birthdateFolder"))
                .Returns(new[]{"birthdateFolder\\{someFileName}.pdf.png", "birthdateFolder\\{otherFilename.pdf.png}"});
            fileLoader.Setup(foo => foo.EnumerateFiles("firstnameFolder"))
                .Returns(new[]{"firstnameFolder\\{someFileName}.pdf.png", "firstnameFolder\\{otherFilename.pdf.png}"});
            fileLoader.Setup(foo => foo.EnumerateFiles("lastnameFolder"))
                .Returns(new[]{"lastnameFolder\\{someFileName}.pdf.png", "lastnameFolder\\{otherFilename.pdf.png}"});
            
            var basePath = new Mock<IBasePath>();
            basePath.Setup(foo => foo.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var datasetsController = new DatasetsController(fileLoader.Object, basePath.Object);
            
            var result = await datasetsController.GetFilesFromFileName(urlContent);
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            var value = okResult.Value;

            var expectedResult = new[]
                {"firstnameFolder\\{someFileName}.pdf.png", "lastnameFolder\\{someFileName}.pdf.png"};
            
            Assert.Equal(expectedResult, value);
        }
        
        [Fact]
        public async Task ShouldSaveJson()
        {
            var httpResult = "{\"Url\":\"https://urlResult\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder\\\\{fileName}_pdf.json\",\"ImageDirectory\":\"someFolder\\\\Images\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_httpResult\\\"}\",\"Headers\":[],\"TimeMs\":10910,\"TicksAt\":637508841406256500}";

            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.WriteAllTextInFileAsync(@"someFolder\{fileName}_pdf.json", It.IsAny<string>()));

            var basePath = new Mock<IBasePath>();
            basePath.Setup(foo => foo.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var datasetsController = new DatasetsController(fileLoader.Object, basePath.Object);
            await datasetsController.SaveJson(JsonConvert.DeserializeObject<Cli.Program.HttpResult>(httpResult));
            
            var expectedResultHttpResult =
                JsonConvert.SerializeObject(JsonConvert.DeserializeObject(httpResult), Formatting.Indented);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"someFolder\{fileName}_pdf.json", expectedResultHttpResult));
        }
    }
}
