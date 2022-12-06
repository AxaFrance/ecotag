using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Oidc;

namespace Ml.Cli.WebApp.Server.Groups;

[ExcludeFromCodeCoverage]
public static class ConfigureExtension
{
    public static void ConfigureGroups(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseMode = configuration[DatabaseSettings.Mode];
        if (databaseMode == DatabaseMode.Sqlite) {
            var connectionString = configuration.GetConnectionString("EcotagGroup") ?? "Data Source=.db/EcotagGroup.db";
            services.AddSqlite<GroupContext>(connectionString);
        }
        else
        {
            services.AddDbContext<GroupContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        }
        services.AddScoped<GroupsRepository, GroupsRepository>();
        services.AddScoped<UsersRepository, UsersRepository>();
        services.AddScoped<CreateGroupCmd, CreateGroupCmd>();
        services.AddScoped<GetAllGroupsCmd, GetAllGroupsCmd>();
        services.AddScoped<GetGroupCmd, GetGroupCmd>();
        services.AddScoped<GetAllUsersCmd, GetAllUsersCmd>();
        services.AddScoped<CreateUserCmd, CreateUserCmd>();
        services.AddScoped<IOidcUserInfoService, OidcUserInfoService>();
        services.AddScoped<UpdateGroupCmd, UpdateGroupCmd>();
    }
}