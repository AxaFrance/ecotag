using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;

namespace Ml.Cli.WebApp.Server.Groups;

public static class ConfigureExtension
{
    public static void ConfigureGroupRattachment(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<GroupContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("GroupContext")));
        services.AddScoped<GroupContext, GroupContext>();
        services.AddScoped<IGroupsRepository, GroupsRepository>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<CreateGroupCmd, CreateGroupCmd>();
        services.AddScoped<GetAllGroupsCmd, GetAllGroupsCmd>();
        services.AddScoped<GetGroupCmd, GetGroupCmd>();
        services.AddScoped<GetAllUsersCmd, GetAllUsersCmd>();
        services.AddScoped<UpdateGroupCmd, UpdateGroupCmd>();
    }
}