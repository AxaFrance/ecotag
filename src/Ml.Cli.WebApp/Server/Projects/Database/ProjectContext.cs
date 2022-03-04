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

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer(
                "Data Source=localhost,1433;Initial Catalog=EcotagContent;Integrated Security=False;User ID=sa;Password=Your_password123;MultipleActiveResultSets=True");
        }
    }
    
    public virtual DbSet<ProjectModel> Projects { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
}