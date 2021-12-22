using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobCompare;
using Ml.Cli.PathManager;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class CompareUnitTest
    {
        [Fact]
        public async Task CompareShouldCallCompareAsync()
        {
            var jsonContent =
                "{\"Url\":\"Url Path\",\"FileName\":\"{FileName}.pdf\",\"FileDirectory\":\"File Directory Path\",\"StatusCode\":200,\"Body\":\"{\\\"analysis\\\":[{\\\"elements\\\":[{\\\"document_type\\\":\\\"nouveau_permis_recto\\\",\\\"confidence_rate\\\":99.9,\\\"status\\\":\\\"OK\\\",\\\"status_reason\\\":null,\\\"url_file_new_recto_zone\\\":\\\"https://url1\\\",\\\"url_file_new_recto_orientation\\\":\\\"https://url2\\\",\\\"license_delivery_country\\\":\\\"France\\\",\\\"birthdate\\\":{\\\"raw_value\\\":\\\"raw_birthdate\\\",\\\"value\\\":\\\"value_birthdate\\\",\\\"confidence_rate\\\":87.66666666666667},\\\"birthplace\\\":{\\\"raw_value\\\":\\\"raw_birthplace\\\",\\\"value\\\":\\\"value_birthplace\\\",\\\"confidence_rate\\\":87.66666666666667},\\\"license_number\\\":{\\\"raw_value\\\":\\\"raw_license_number\\\",\\\"value\\\":\\\"value_license_number\\\",\\\"confidence_rate\\\":100},\\\"mrz\\\":{\\\"raw_value\\\":\\\"raw_mrz\\\",\\\"value\\\":\\\"value_mrz\\\",\\\"confidence_rate\\\":100},\\\"license_validity_date\\\":{\\\"raw_value\\\":\\\"raw_license_validity_date\\\",\\\"value\\\":\\\"value_license_validity_date\\\",\\\"confidence_rate\\\":100},\\\"firstname\\\":{\\\"raw_value\\\":\\\"raw_firstname\\\",\\\"value\\\":\\\"value_firstname\\\",\\\"confidence_rate\\\":92.25},\\\"license_category_list\\\":{\\\"raw_value\\\":\\\"raw_license_category_list\\\",\\\"value\\\":\\\"value_license_category_list\\\",\\\"confidence_rate\\\":92},\\\"lastname\\\":{\\\"raw_value\\\":\\\"raw_lastname\\\",\\\"value\\\":\\\"value_lastname\\\",\\\"confidence_rate\\\":100},\\\"license_delivery_date\\\":{\\\"raw_value\\\":\\\"raw_license_delivery_date\\\",\\\"value\\\":\\\"value_license_delivery_date\\\",\\\"confidence_rate\\\":87},\\\"license_delivery_place\\\":{\\\"raw_value\\\":\\\"raw_pr\u00E9fet\\\",\\\"value\\\":\\\"value_pr\u00E9fet\\\",\\\"confidence_rate\\\":90},\\\"document_id\\\":\\\"0\\\"}],\\\"page\\\":1,\\\"status\\\":\\\"OK\\\"}],\\\"version\\\":1}\",\"Headers\":[],\"TimeMs\":9069,\"TicksAt\":637453731518053200}";
            var logger = Mock.Of<ILogger<TaskCompare>>();
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>())).Returns(new List<string> {"{FileName}.pdf.json"});
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync("C:\\ml\\raw_ap\\input\\left\\{FileName}.pdf.json")).Returns(Task.FromResult(jsonContent));
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync("C:\\ml\\raw_ap\\input\\right\\{FileName}.pdf.json")).Returns(Task.FromResult(jsonContent));
            fileLoader.Setup(mock => mock.FileExists(It.IsAny<string>())).Returns(true);
            fileLoader.Setup(mock => mock.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(mock => mock.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            
            var compare = new TaskCompare(fileLoader.Object, logger);
            
            var inputTask = new CompareTask(
                "compare",
                "taskId",
                true,
                @"C:\ml\raw_ap\input\left",
                @"C:\ml\raw_ap\input\right",
                @"C:\ml\raw_ap\output",
                "{FileName}.pdf.json",
                "warning"
                );

            await compare.CompareAsync(inputTask);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\output\{FileName}.pdf.json", It.IsAny<string>()), Times.Once);
        }

        [Fact]
        public async Task ShouldSaveNonHttpResultFiles()
        {
            var contentLeft = "This is the content of the file on the left";
            var contentRight = "This is the content of the file on the right";

            var httpResultLeft = new Program.HttpResult()
            {
                FileName = "{FileName}.json",
                FileDirectory = @"C:\ml\raw_ap\input\left\{FileName}.json",
                ImageDirectory = "",
                FrontDefaultStringsMatcher = "",
                StatusCode = 200,
                Body = contentLeft,
                Headers = new List<KeyValuePair<string, IEnumerable<string>>>(),
                TimeMs = 0,
                Url = null,
                TicksAt = 0
            };
            var httpResultRight = new Program.HttpResult()
            {
                FileName = "{FileName}.json",
                FileDirectory = @"C:\ml\raw_ap\input\right\{FileName}.json",
                ImageDirectory = "",
                FrontDefaultStringsMatcher = "",
                StatusCode = 200,
                Body = contentRight,
                Headers = new List<KeyValuePair<string, IEnumerable<string>>>(),
                TimeMs = 0,
                Url = null,
                TicksAt = 0
            };
            var compareResult = new CompareResult {FileName = "{FileName}.json", Left = httpResultLeft, Right = httpResultRight};
            var expectedResult = new FileResult(
                @"C:\ml\raw_ap\output\{FileName}.json",
                new List<CompareResult>()
                {
                    compareResult
                }
                );
            var expectedString = JsonConvert.SerializeObject(expectedResult, Formatting.Indented);
            
            var logger = Mock.Of<ILogger<TaskCompare>>();
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>())).Returns(new List<string>{"{FileName}.json"});
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync("C:\\ml\\raw_ap\\input\\left\\{FileName}.json")).Returns(Task.FromResult(contentLeft));
            fileLoader.Setup(mock => mock.ReadAllTextInFileAsync("C:\\ml\\raw_ap\\input\\right\\{FileName}.json")).Returns(Task.FromResult(contentRight));
            fileLoader.Setup(mock => mock.FileExists(It.IsAny<string>())).Returns(true);
            fileLoader.Setup(mock => mock.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(mock => mock.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            
            var compare = new TaskCompare(fileLoader.Object, logger);
            
            var inputTask = new CompareTask(
                "compare",
                "taskId",
                true,
                @"C:\ml\raw_ap\input\left",
                @"C:\ml\raw_ap\input\right",
                @"C:\ml\raw_ap\output",
                "{FileName}.json",
                "warning"
            );

            await compare.CompareAsync(inputTask);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\output\{FileName}.json", expectedString));
        }

        [Fact]
        public void ShouldInitialize()
        {
            var jsonContent = "{\"type\": \"compare\",\"enabled\": true,\"onFileNotFound\": \"warning\",\"leftDirectory\": \"licenses/groundtruth/jsons\",\"rightDirectory\": \"licenses/output/{start-date}/jsons\",\"outputDirectory\": \"licenses/compares\",\"fileName\": \"compare-licenses-{start-date}.json\"}";
            var jObject = JObject.Parse(jsonContent);
            var pathValidatorHelper = new Mock<IPathValidatorHelper>();

            var compareResult = JobCompare.Initializer.CreateTask(jObject, "compare", false, true, "baseDirectory", "1", pathValidatorHelper.Object);
            var expectedCompareResult = new CompareTask(
                "compare",
                "1",
                false,
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/groundtruth/jsons"),
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/output/{start-date}/jsons"),
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/compares"),
                "compare-licenses-{start-date}.json",
                "warning"
                );
            Assert.Equal(JsonConvert.SerializeObject(expectedCompareResult), JsonConvert.SerializeObject(compareResult));
        }
    }
}