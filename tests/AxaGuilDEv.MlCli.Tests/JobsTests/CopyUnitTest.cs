using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.JobCopy;
using Ml.Cli.PathManager;
using Moq;
using Xunit;

namespace Ml.Cli.Tests.JobsTests;

public class CopyUnitTest
{
    [Fact]
    public async Task CopyShouldCopyFilesFromDirectoryAsync()
    {
        var logger = Mock.Of<ILogger<TaskCopy>>();
        var fileLoader = new Mock<IFileLoader>();
        fileLoader.Setup(mock => mock.EnumerateFiles(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(new List<string> { "baseDirectory/from/demo.pdf.json" });
        fileLoader.Setup(mock => mock.Copy(It.IsAny<string>(), It.IsAny<string>()));

        var copy = new TaskCopy(fileLoader.Object, logger);

        var inputTask = new CopyTask(
            "copy",
            "taskId",
            true,
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/from"),
            "*.json",
            PathAdapter.AdaptPathForCurrentOs("baseDirectory/to")
        );

        await copy.CopyAsync(inputTask);

        fileLoader.Verify(mock => mock.Copy(It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }
}