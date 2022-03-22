using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects.Database;

public class ProjectContext : DbContext
{
    public ProjectContext() { }

    public ProjectContext(DbContextOptions<ProjectContext> options) : base(options)
    {
    }

    public ProjectContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<ProjectModel> Projects { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
}