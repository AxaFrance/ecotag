using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GroupUsersModel>()
            .HasKey(gu => new { gu.GroupId, gu.UserId });
        modelBuilder.Entity<GroupUsersModel>()
            .HasOne(gu => gu.Group)
            .WithMany(g => g.GroupUsers)
            .HasForeignKey(gu => gu.GroupId);
        modelBuilder.Entity<GroupUsersModel>()
            .HasOne(gu => gu.User)
            .WithMany(u => u.GroupUsers)
            .HasForeignKey(gu => gu.UserId);
    }

    public virtual DbSet<GroupModel> Groups { get; set; }
    
    public virtual DbSet<GroupUsersModel> GroupUsers { get; set; }
    
    public virtual DbSet<UserModel> Users { get; set; }

}