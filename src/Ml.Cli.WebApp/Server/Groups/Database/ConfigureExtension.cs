using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ml.Cli.WebApp.Server.Groups.Database;

public static class ConfigureExtension
{
    public static void ConfigureGroupRattachment(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<GroupContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("GroupContext")));
        services.AddScoped<GroupContext, GroupContext>();
        services.AddScoped<IGroupsRepository, GroupsRepository>();
    }
}