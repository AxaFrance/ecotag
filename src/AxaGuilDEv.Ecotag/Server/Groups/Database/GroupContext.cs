using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.GroupUsers;
using Ml.Cli.WebApp.Server.Groups.Database.Users;

namespace Ml.Cli.WebApp.Server.Groups.Database;

public class GroupContext : DbContext
{
    public GroupContext()
    {
    }

    public GroupContext(DbContextOptions<GroupContext> options) : base(options)
    {
    }

    public GroupContext(DbContextOptionsBuilder options) : base(options.Options)
    {
    }

    public virtual DbSet<GroupModel> Groups { get; set; }

    public virtual DbSet<GroupUsersModel> GroupUsers { get; set; }

    public virtual DbSet<UserModel> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var userBuilder = modelBuilder.Entity<UserModel>();
        userBuilder.HasIndex(u => u.Email).IsUnique();

        var groupUsersModelBuilder = modelBuilder.Entity<GroupUsersModel>();

        groupUsersModelBuilder
            .HasKey(gu => new { gu.GroupId, gu.UserId });
        groupUsersModelBuilder
            .HasOne(gu => gu.Group)
            .WithMany(g => g.GroupUsers)
            .HasForeignKey(gu => gu.GroupId);
        groupUsersModelBuilder
            .HasOne(gu => gu.User)
            .WithMany(u => u.GroupUsers)
            .HasForeignKey(gu => gu.UserId);

        if (Database.IsSqlite())
        {
            userBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());

            var groupBuilder = modelBuilder.Entity<GroupModel>();
            groupBuilder.Property(u => u.Id).HasConversion(new GuidToStringConverter());

            groupUsersModelBuilder.Property(u => u.GroupId).HasConversion(new GuidToStringConverter());
            groupUsersModelBuilder.Property(u => u.UserId).HasConversion(new GuidToStringConverter());
        }
    }
}