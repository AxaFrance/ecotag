using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.Users;

public class UserContext : DbContext
{
    public UserContext() { }

    public UserContext(DbContextOptions<UserContext> options) : base(options)
    {
    }

    public UserContext(DbContextOptionsBuilder options) : base(options.Options)
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
    
    public virtual DbSet<UserModel> Users { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
}