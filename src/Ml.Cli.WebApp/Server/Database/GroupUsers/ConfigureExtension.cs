using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ml.Cli.WebApp.Server.Database.GroupUsers;

public static class ConfigureExtension
{
    public static void ConfigureGroupUsersRattachment(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<GroupUsersContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("GroupUsersContext")));
        services.AddScoped<GroupUsersContext, GroupUsersContext>();
        services.AddScoped<IGroupUsersRepository, GroupUsersRepository>();
    }
}