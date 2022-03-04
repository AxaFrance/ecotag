using System.Threading.Tasks;

namespace Ml.Cli.WebApp.Server.Projects.Database.Project;

public interface IProjectsRepository
{
    Task<ResultWithError<string, ErrorResult>> CreateProjectAsync(string projectName);
}