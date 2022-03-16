using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Database.Users;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Groups.Database;
using Ml.Cli.WebApp.Server.Groups.Database.Group;
using Ml.Cli.WebApp.Server.Groups.Database.Users;
using Ml.Cli.WebApp.Server.Groups.Oidc;

namespace Ml.Cli.WebApp.Server.Datasets;

public static class ConfigureExtension
{
    public static void ConfigureDatasets(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DatasetContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        services.AddScoped<DatasetsRepository, DatasetsRepository>();
        services.AddScoped<CreateDatasetCmd, CreateDatasetCmd>();
        services.AddScoped<ListDatasetCmd, ListDatasetCmd>();
    }
}