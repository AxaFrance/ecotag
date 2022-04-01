using System.Threading.Tasks;
using Xunit;

namespace Ml.Cli.WebApp.Tests.Server.Projects;

public class ExportShould
{
    [Theory]
    [InlineData("", "")]
    public async Task Should_Export_Project(string projectId, string nameIdentifier)
    {
        
    }
}