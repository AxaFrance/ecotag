using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.FileLoader;
using AxaGuilDEv.MlCli.JobCopy;
using AxaGuilDEv.MlCli.PathManager;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AxaGuilDEv.MlCli.Tests.JobsTests;

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