using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Ml.Cli.WebApp.Server.Groups.Database;

public class GroupContext : DbContext
{
    public GroupContext() { }

    public GroupContext(DbContextOptions<GroupContext> options) : base(options)
    {
    }

    public GroupContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Data Source=localhost,1433;Initial Catalog=EcotagContent;Integrated Security=False;User ID=sa;Password=Your_password123;MultipleActiveResultSets=True");
        }
    }
    
    public virtual DbSet<GroupModel> Groups { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
}