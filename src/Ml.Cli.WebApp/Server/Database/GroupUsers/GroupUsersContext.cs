using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public class GroupUsersContext : DbContext
{
    public GroupUsersContext() { }

    public GroupUsersContext(DbContextOptions<GroupUsersContext> options) : base(options)
    {
    }

    public GroupUsersContext(DbContextOptionsBuilder options) : base(options.Options)
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
    
    public virtual DbSet<GroupUsersModel> GroupUsers { get; set; }

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }
}