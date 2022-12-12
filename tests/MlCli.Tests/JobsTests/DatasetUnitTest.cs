using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.FileLoader;
using AxaGuilDEv.MlCli.JobCompare;
using AxaGuilDEv.MlCli.JobDataset;
using AxaGuilDEv.MlCli.PathManager;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;
using Initializer = AxaGuilDEv.MlCli.JobDataset.Initializer;

namespace AxaGuilDEv.MlCli.Tests.JobsTests;

public class DatasetUnitTest
{
    [Fact]
    public async Task ShouldGenerateDataset()
    {
        var resultList = new List<DatasetResult>();
        var datasetResult = new DatasetResult("{FileName}.pdf.json",
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/input"),
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/images"), "", "");
        resultList.Add(datasetResult);
        var expectedContent =
            new DatasetFileResult(
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/output/dataset-result.json"), "Ocr", "",
                resultList);
        var expectedResult = JsonConvert.SerializeObject(expectedContent, Formatting.Indented);

        var logger = Mock.Of<ILogger<TaskCompare>>();
        var fileLoader = new Mock<IFileLoader>();
        fileLoader.Setup(mock => mock.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(new List<string> { "{FileName}.pdf.json" });
        fileLoader.Setup(mock => mock.CreateDirectory(It.IsAny<string>()));
        fileLoader.Setup(mock => mock.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));

        var datasetTask = new TaskDataset(fileLoader.Object, logger);
        var inputTask = new DatasetTask(
            "task_id",
            "dataset",
            true,
            "Ocr",
            "",
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/input"),
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/images"),
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/output"),
            "",
            "dataset-result.json",
            ""
        );

        await datasetTask.GenerateDatasetAsync(inputTask);

        fileLoader.Verify(mock =>
            mock.WriteAllTextInFileAsync(
                PathAdapter.AdaptPathForCurrentOs("baseDirectory/ml/raw_ap/output/dataset-result.json"),
                expectedResult));
    }

    [Fact]
    public void ShouldInitialize()
    {
        var jsonContent =
            "{\"type\": \"dataset\",\"enabled\": true,\"annotationType\": \"JsonEditor\",\"fileDirectory\": \"licenses/output/{start-date}/jsons\",\"imageDirectory\": \"licenses/output/{start-date}/images\",\"outputDirectory\": \"licenses/datasets\",\"fileName\": \"dataset-{start-date}-jsoneditor.json\"}";
        var jObject = JObject.Parse(jsonContent);
        var pathValidatorHelper = new Mock<IPathValidatorHelper>();

        var datasetResult = Initializer.CreateTask(jObject, "dataset", false, true, "baseDirectory", "1",
            pathValidatorHelper.Object);
        var expectedDatasetResult = new DatasetTask(
            "1",
            "dataset",
            false,
            "JsonEditor",
            "",
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/output/{start-date}/jsons"),
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/output/{start-date}/images"),
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/licenses/datasets"),
            "",
            "dataset-{start-date}-jsoneditor.json",
            ""
        );
        Assert.Equal(JsonConvert.SerializeObject(expectedDatasetResult), JsonConvert.SerializeObject(datasetResult));
    }
}