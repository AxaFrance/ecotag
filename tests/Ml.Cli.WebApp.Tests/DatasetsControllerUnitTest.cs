using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.FileLoader;
using Ml.Cli.WebApp.Controllers;
using Ml.Cli.WebApp.Paths;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.WebApp.Tests
{
    public class DatasetsControllerUnitTest
    {
        [Fact]
        public void ShouldGetMatchingFiles()
        {
            var urlContent =
                "fileName={someFileName}_pdf.json&stringsMatcher=firstname, lastname&directory=someDirectory";
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateDirectories(It.IsAny<string>()))
                .Returns(new[]{"birthdateFolder", "firstnameFolder", "lastnameFolder"});
            
            fileLoader.Setup(mock => mock.EnumerateFiles("birthdateFolder"))
                .Returns(new[]{"birthdateFolder\\{someFileName}.pdf.png", "birthdateFolder\\{otherFilename.pdf.png}"});
            fileLoader.Setup(mock => mock.EnumerateFiles("firstnameFolder"))
                .Returns(new[]{"firstnameFolder\\{someFileName}.pdf.png", "firstnameFolder\\{otherFilename.pdf.png}"});
            fileLoader.Setup(mock => mock.EnumerateFiles("lastnameFolder"))
                .Returns(new[]{"lastnameFolder\\{someFileName}.pdf.png", "lastnameFolder\\{otherFilename.pdf.png}"});
            
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var datasetsPaths = new DatasetsPaths("");
            
            var datasetsController = new DatasetsController(fileLoader.Object, basePath.Object, datasetsPaths);
            
            var result = datasetsController.GetFilesFromFileName(Convert.ToBase64String(Encoding.UTF8.GetBytes(urlContent)));
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
            fileLoader.Setup(mock => mock.WriteAllTextInFileAsync(@"someFolder\{fileName}_pdf.json", It.IsAny<string>()));

            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var datasetsPaths = new DatasetsPaths("");
            
            var datasetsController = new DatasetsController(fileLoader.Object, basePath.Object, datasetsPaths);
            await datasetsController.SaveJson(JsonConvert.DeserializeObject<Cli.Program.HttpResult>(httpResult));
            
            var expectedResultHttpResult =
                JsonConvert.SerializeObject(JsonConvert.DeserializeObject(httpResult), Formatting.Indented);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"someFolder\{fileName}_pdf.json", expectedResultHttpResult));
        }
    }
}
