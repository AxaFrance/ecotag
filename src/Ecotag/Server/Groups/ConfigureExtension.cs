using System.Diagnostics.CodeAnalysis;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Server.Groups.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Group;
using AxaGuilDEv.Ecotag.Server.Groups.Database.Users;
using AxaGuilDEv.Ecotag.Server.Groups.Oidc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AxaGuilDEv.Ecotag.Server.Groups;

[ExcludeFromCodeCoverage]
public static class ConfigureExtension
{
    public static void ConfigureGroups(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseSettings = configuration.GetSection(DatabaseSettings.Database).Get<DatabaseSettings>();
        if (databaseSettings.Mode == DatabaseMode.Sqlite)
        {
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