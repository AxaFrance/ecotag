using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobCompare;
using Ml.Cli.JobDataset;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.Tests.JobsTests
{
    public class DatasetUnitTest
    {
        [Fact]
        public async Task ShouldGenerateDataset()
        {
            var resultList = new List<DatasetResult>();
            var datasetResult = new DatasetResult("{FileName}.pdf.json", @"C:\ml\raw_ap\input", @"C:\ml\raw_ap\images",new Dictionary<string, Annotation>());
            resultList.Add(datasetResult);
            var expectedContent = new DatasetFileResult(@"C:\ml\raw_ap\output\dataset-result.json", resultList);
            var expectedResult = JsonConvert.SerializeObject(expectedContent, Formatting.Indented);

            var logger = Mock.Of<ILogger<TaskCompare>>();
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>())).Returns(new List<string> {"{FileName}.pdf.json"});
            fileLoader.Setup(foo => foo.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(foo => foo.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            
            var datasetTask = new TaskDataset(fileLoader.Object, logger);
            var inputTask = new DatasetTask(
                "task_id",
                "dataset",
                true,
                "cropping",
                @"C:\ml\raw_ap\input",
                @"C:\ml\raw_ap\images",
                @"C:\ml\raw_ap\output",
                "dataset-result.json"
            );

            await datasetTask.GenerateDatasetAsync(inputTask);
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\output\dataset-result.json", expectedResult));
        }
    }
}
