using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobVersion;
using Moq;
using Moq.Contrib.HttpClient;
using Xunit;
using Version = Ml.Cli.JobVersion.Version;

namespace Ml.Cli.Tests.JobsTests
{
    public class VersionUnitTest
    {
        [Fact]
        public async Task ShouldWaitVersionUpdate()
        {
            var handler = new Mock<HttpMessageHandler>();
            var factory = handler.CreateClientFactory();

            var contentJSON = "[\r\n  {\r\n    \"url\": \"https://url\",\r\n    \"version\": \"1.0\"\r\n  }\r\n]";
            var result = "[\r\n  {\r\n    \"url\": \"https://url\",\r\n    \"version\": \"{\\\"version\\\":\\\"2.0\\\"}\"\r\n  }\r\n]";

            Mock.Get(factory).Setup(x => x.CreateClient("Default")).Returns(() =>
            {
                var client = handler.CreateClient();
                handler.SetupRequest(HttpMethod.Get, "https://url").ReturnsResponse("{\"version\":\"1.0\"}")
                    .Callback(() => handler.SetupRequest(HttpMethod.Get, "https://url").ReturnsResponse("{\"version\":\"2.0\"}"));
                return client;
            });
            
            var logger = new Mock<ILogger<Version>>();
    
            var fileLoader = new Mock<IFileLoader>();
            fileLoader.Setup(mock => mock.CreateDirectory(It.IsAny<string>()));
            fileLoader.Setup(mock => mock.WriteAllTextInFileAsync(It.IsAny<string>(), It.IsAny<string>()));
            fileLoader.Setup(mock => mock.Load(It.IsAny<string>())).Returns(contentJSON);
            fileLoader.Setup(mock => mock.FileExists(It.IsAny<string>())).Returns(false)
                .Callback(() => fileLoader.Setup(foo => foo.FileExists(It.IsAny<string>())).Returns(true));

            var version = new Version(factory, fileLoader.Object, logger.Object);
            
            var inputTask = new VersionTask(
                "wait_version_change",
                "unique_id",
                true,
                "https://url",
                200,
                @"C:\ml\raw_ap\urlLog",
                "urlLog.json"
            );

            await version.WaitVersionChange(inputTask);
            
            logger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => string.Equals("New version acquired: {\"version\":\"2.0\"}; url: https://url", o.ToString())),
                    It.IsAny<Exception>(),
                    (Func<It.IsAnyType, Exception, string>) It.IsAny<object>()),
                Times.Once
            );
            
            fileLoader.Verify(mock => mock.WriteAllTextInFileAsync(@"C:\ml\raw_ap\urlLog\urlLog.json", result));
        }
    }
}