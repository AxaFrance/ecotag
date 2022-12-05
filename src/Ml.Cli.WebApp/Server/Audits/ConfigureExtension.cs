using System.Diagnostics.CodeAnalysis;
using FileContextCore;
using FileContextCore.FileManager;
using FileContextCore.Serializer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Audits.Database;
using Ml.Cli.WebApp.Server.Datasets.Database;

namespace Ml.Cli.WebApp.Server.Audits;

public static class ConfigureExtension
{
    [ExcludeFromCodeCoverage]
    public static void ConfigureServiceAudits(this IServiceCollection services, IConfiguration configuration)
    {
       // services.AddDbContext<AuditContext>(options =>
        //    options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        var connectionString = configuration.GetConnectionString("EcotagAudit") ?? "Data Source=.db/EcotagAudit.db";
        services.AddSqlite<AuditContext>(connectionString);
        services.AddSingleton<IQueue, Queue>();
        services.AddSingleton<AuditsService, AuditsService>();
        services.AddScoped<AuditsRepository, AuditsRepository>();
    }
    
}