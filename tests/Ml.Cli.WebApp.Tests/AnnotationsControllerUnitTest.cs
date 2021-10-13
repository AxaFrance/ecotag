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
    public class AnnotationsControllerUnitTest
    {
        [Fact]
        public async Task ShouldGetFileContent()
        {
            var fileContent = "{\"Url\":\"https://urlResult\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder\\\\{fileName}_pdf.json\",\"ImageDirectory\":\"someFolder\\\\Images\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_fileName\\\"}\",\"Headers\":[],\"TimeMs\":10910,\"TicksAt\":637508841406256500}";
            var expectedResult = JsonConvert.DeserializeObject<Cli.Program.HttpResult>(fileContent);
            
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync("C:\\{fileName}.pdf.json")).ReturnsAsync(fileContent);
            
            var annotationsController = new AnnotationsController(fileLoader.Object, basePath.Object);

            var result = await annotationsController.GetBody(Convert.ToBase64String(Encoding.UTF8.GetBytes("C:\\{fileName}.pdf.json")));
            var httpResult = (result as ObjectResult).Value as Cli.Program.HttpResult;
            Assert.Equal(expectedResult.Body, httpResult.Body);
        }

        [Fact]
        public async Task ShouldSaveFile()
        {
            var datasetFileContent = "{\"DatasetLocation\": \"C:\\\\someFolder\\\\datasetFile.json\",\"AnnotationType\": \"Ocr\",\"Configuration\": \"[{\\\"name\\\": \\\"Date\\\", \\\"id\\\": 0}, {\\\"name\\\": \\\"City name\\\", \\\"id\\\": 1}]\",\"Content\": [{\"FileName\": \"{fileName}.json\",\"FileDirectory\": \"\",\"ImageDirectory\": \"\",\"FrontDefaultStringsMatcher\": \"\",\"Annotations\": \"\"}]}";
            var datasetInfo = new AnnotationsController.DatasetInfo("C:\\\\someFolder\\\\datasetFile.json", "{fileName}.json", "{\"labels\": \"some_content\"}");

            var expectedResult = "{\"DatasetLocation\": \"C:\\\\someFolder\\\\datasetFile.json\",\"AnnotationType\": \"Ocr\",\"Configuration\": \"[{\\\"name\\\": \\\"Date\\\", \\\"id\\\": 0}, {\\\"name\\\": \\\"City name\\\", \\\"id\\\": 1}]\",\"Content\": [{\"FileName\": \"{fileName}.json\",\"FileDirectory\": \"\",\"ImageDirectory\": \"\",\"FrontDefaultStringsMatcher\": \"\",\"Annotations\": \"[{{\\\"labels\\\": \\\"some_content\\\"}}]\"}]}";
            var indentedResult = JsonConvert.SerializeObject(JsonConvert.DeserializeObject(expectedResult), Formatting.Indented);
            
            var basePath = new Mock<BasePath>("");
            basePath.Setup(mock => mock.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync("C:\\\\someFolder\\\\datasetFile.json")).ReturnsAsync(datasetFileContent);
            fileLoader.Setup(mock =>
                mock.WriteAllTextInFileAsync("C:\\\\someFolder\\\\datasetFile.json", It.IsAny<string>()));
            
            var annotationsController = new AnnotationsController(fileLoader.Object, basePath.Object);

            await annotationsController.SaveAnnotation(datasetInfo);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync("C:\\\\someFolder\\\\datasetFile.json", indentedResult));
        }
    }
}