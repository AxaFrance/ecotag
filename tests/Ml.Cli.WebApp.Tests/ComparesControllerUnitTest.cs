using System.Collections.Generic;
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
    public class ComparesControllerUnitTest
    {
        [Fact]
        public async Task ShouldSaveCompareFile()
        {
            var httpResultLeft = "{\"Url\":\"https://urlResult\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder\\\\{fileName}_pdf.json\",\"ImageDirectory\":\"someFolder\\\\Images\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_left_fileName\\\"}\",\"Headers\":[],\"TimeMs\":10910,\"TicksAt\":637508841406256500}";
            var httpResultRight = "{\"Url\":\"https://urlResult\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder\\\\{fileName}_pdf.json\",\"ImageDirectory\":\"someFolder\\\\Images\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_httpResult\\\"}\",\"Headers\":[],\"TimeMs\":10910,\"TicksAt\":637508841406256500}";
            var jsonCompareContent = "{\"CompareLocation\":\"someFolder\\\\compareFile.json\",\"Content\":[{\"FileName\":\"{other_file}_pdf.json\",\"Left\":{\"Url\":\"https://url\",\"FileName\":\"{other_file}.pdf\",\"FileDirectory\":\"someFolder1\\\\{other_file}_pdf.json\",\"ImageDirectory\":null,\"FrontDefaultStringsMatcher\":null,\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_left_other_file\\\"}\",\"Headers\":[],\"TimeMs\":0,\"TicksAt\":0},\"Right\":{\"Url\":\"https://url\",\"FileName\":\"{other_file}.pdf\",\"FileDirectory\":\"someFolder2\\\\{other_file}_pdf.json\",\"ImageDirectory\":\"someFolderImages\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_right_other_file\\\"}\",\"Headers\":[],\"TimeMs\":1,\"TicksAt\":1}},{\"FileName\":\"{fileName}_pdf.json\",\"Left\":{\"Url\":\"https://url\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder1\\\\{fileName}_pdf.json\",\"ImageDirectory\":null,\"FrontDefaultStringsMatcher\":null,\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_left_fileName\\\"}\",\"Headers\":[],\"TimeMs\":0,\"TicksAt\":0},\"Right\":{\"Url\":\"https://url\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder2\\\\{fileName}_pdf.json\",\"ImageDirectory\":\"someFolderImages\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_to_update\\\"}\",\"Headers\":[],\"TimeMs\":1,\"TicksAt\":1}}]}";
            
            var contentObject = new ItemInfo("FileName", JsonConvert.DeserializeObject<Cli.Program.HttpResult>(httpResultLeft), JsonConvert.DeserializeObject<Cli.Program.HttpResult>(httpResultRight));
            var editorContent = new EditorContent(
                "someFolder\\\\compareFile.json",
                JsonConvert.SerializeObject(contentObject),
                "someFolder\\\\{fileName}_pdf.json"
            );
            
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.ReadAllTextInFileAsync("someFolder\\\\compareFile.json")).ReturnsAsync(jsonCompareContent);
            fileLoader.Setup(foo => foo.WriteAllTextInFileAsync("someFolder\\\\compareFile.json", It.IsAny<string>()));

            var basePath = new Mock<BasePath>();
            basePath.Setup(foo => foo.IsPathSecure(It.IsAny<string>())).Returns(true);
            
            var comparesPath = new ComparesPaths("");

            var compareController = new ComparesController(fileLoader.Object, basePath.Object, comparesPath);
            await compareController.SaveCompare(editorContent);
            
            var compareResultContent = "{\"CompareLocation\":\"someFolder\\\\compareFile.json\",\"Content\":[{\"FileName\":\"{other_file}_pdf.json\",\"Left\":{\"Url\":\"https://url\",\"FileName\":\"{other_file}.pdf\",\"FileDirectory\":\"someFolder1\\\\{other_file}_pdf.json\",\"ImageDirectory\":null,\"FrontDefaultStringsMatcher\":null,\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_left_other_file\\\"}\",\"Headers\":[],\"TimeMs\":0,\"TicksAt\":0},\"Right\":{\"Url\":\"https://url\",\"FileName\":\"{other_file}.pdf\",\"FileDirectory\":\"someFolder2\\\\{other_file}_pdf.json\",\"ImageDirectory\":\"someFolderImages\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_right_other_file\\\"}\",\"Headers\":[],\"TimeMs\":1,\"TicksAt\":1}},{\"FileName\":\"{fileName}_pdf.json\",\"Left\":{\"Url\":\"https://url\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder1\\\\{fileName}_pdf.json\",\"ImageDirectory\":null,\"FrontDefaultStringsMatcher\":null,\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_left_fileName\\\"}\",\"Headers\":[],\"TimeMs\":0,\"TicksAt\":0},\"Right\":{\"Url\":\"https://url\",\"FileName\":\"{fileName}.pdf\",\"FileDirectory\":\"someFolder2\\\\{fileName}_pdf.json\",\"ImageDirectory\":\"someFolderImages\",\"FrontDefaultStringsMatcher\":\"rotation\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":\\\"content_body_httpResult\\\"}\",\"Headers\":[],\"TimeMs\":1,\"TicksAt\":1}}]}";
            
            var expectedResultCompareContent =
                JsonConvert.SerializeObject(JsonConvert.DeserializeObject(compareResultContent), Formatting.Indented);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync("someFolder\\\\compareFile.json", expectedResultCompareContent));
        }

        [Fact]
        public async Task ShouldGetJsonFiles()
        {
            var basePath = new Mock<BasePath>();
            basePath.Setup(foo => foo.IsPathSecure(It.IsAny<string>())).Returns(true);
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.EnumerateFiles("someFolder\\\\comparesFolder1"))
                .Returns(new[] {"file1.json", "file2.png", "file3.json"});
            fileLoader.Setup(foo => foo.EnumerateFiles("someFolder\\\\comparesFolder2"))
                .Returns(new[] {"file4.png", "file5.pdf"});
            var comparesPath = new ComparesPaths("someFolder\\\\comparesFolder1,someFolder\\\\comparesFolder2");
            
            var compareController = new ComparesController(fileLoader.Object, basePath.Object, comparesPath);

            var result = await compareController.GetFiles() as ObjectResult;
            
            Assert.NotNull(result);
            Assert.Equal(new List<string>(){"file1.json","file3.json"}, result.Value);
        }
    }
}