using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Audits.Database;

namespace Ml.Cli.WebApp.Server.Audits;

public static class ConfigureExtension
{
    [ExcludeFromCodeCoverage]
    public static void ConfigureServiceAudits(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AuditContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        services.AddSingleton<IQueue, Queue>();
        services.AddSingleton<AuditsService, AuditsService>();
        services.AddScoped<AuditsRepository, AuditsRepository>();
    }
    
}