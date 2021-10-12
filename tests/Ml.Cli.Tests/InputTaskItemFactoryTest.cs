using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.InputTask;
using Ml.Cli.JobApiCall;
using Ml.Cli.PathManager;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Ml.Cli.Tests
{
    public class InputTaskItemFactoryTest
    {
        [Fact]
        public async Task ShouldInsertTimeStamp()
        {
            var dataSource =
                "[{\"type\": \"callapi\",\"enabled\": true,\"fileDirectory\": \"fileDirectory\", \"outputDirectoryJsons\": \"testFolder-{start-date}\", \"url\": \"https://driving-licenses-rec.axa-fr-dev-int.teal.westeurope.azure.openpaas.axa-cloud.com/upload-integration\"}]";
            var baseDirectory = "C:\\test";

            var logger = Mock.Of<ILogger<TaskApiCall>>();
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(foo => foo.ReadAllTextInFileAsync(It.IsAny<string>())).ReturnsAsync(dataSource);
            var pathValidatorHelper = new Mock<IPathValidatorHelper>();
            pathValidatorHelper.Setup(foo => foo.IsPathValid(It.IsAny<string>(), It.IsAny<string>())).Returns(true)
                .Callback(() =>
                    pathValidatorHelper.Setup(foo => foo.IsPathValid(It.IsAny<string>(), It.IsAny<string>()))
                        .Returns(false));
            var services = new ServiceCollection();
            var inputTasks = JsonConvert.DeserializeObject<List<IInputTask>>(
                await fileLoader.Object.ReadAllTextInFileAsync("path"),
                new InputTaskItemFactory(baseDirectory, logger, services, pathValidatorHelper.Object));
            var task = (Callapi) inputTasks?[0];
            var taskDirectory = task?.OutputDirectoryJsons;

            var taskDate = taskDirectory?.Remove(0, 19);
            var tempDate = DateTime.Now.ToLocalTime().ToString("HHmm-dd-MM-yyyy", CultureInfo.InvariantCulture);
            tempDate = tempDate.Insert(2, "h");
            //Remove minutes to prevent a false negative
            tempDate = tempDate.Remove(3, 2);
            taskDate = taskDate?.Remove(3, 2);
            Assert.Equal(tempDate, taskDate);
        }
    }
}