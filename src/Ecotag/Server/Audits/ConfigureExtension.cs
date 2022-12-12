using System.Diagnostics.CodeAnalysis;
using AxaGuilDEv.Ecotag.Server.Audits.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AxaGuilDEv.Ecotag.Server.Audits;

public static class ConfigureExtension
{
    [ExcludeFromCodeCoverage]
    public static void ConfigureServiceAudits(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseSettings = configuration.GetSection(DatabaseSettings.Database).Get<DatabaseSettings>();
        if (databaseSettings.Mode == DatabaseMode.Sqlite)
        {
            var connectionString = configuration.GetConnectionString("EcotagAudit") ?? "Data Source=.db/EcotagAudit.db";
            services.AddSqlite<AuditContext>(connectionString);
        }
        else
        {
            services.AddDbContext<AuditContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        }

        services.AddSingleton<IQueue, Queue>();
        services.AddSingleton<AuditsService, AuditsService>();
        services.AddScoped<AuditsRepository, AuditsRepository>();
    }
}