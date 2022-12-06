using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Cmd.Annotations;
using Ml.Cli.WebApp.Server.Projects.Database;

namespace Ml.Cli.WebApp.Server.Projects;

[ExcludeFromCodeCoverage]
public static class ConfigureExtension
{
    public static void ConfigureProjects(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseMode = configuration[DatabaseSettings.Mode];
        if (databaseMode == DatabaseMode.Sqlite)
        {
            var connectionStringProject = configuration.GetConnectionString("EcotagProject") ?? "Data Source=.db/EcotagProject.db";
            services.AddSqlite<ProjectContext>(connectionStringProject);
            var connectionString = configuration.GetConnectionString("EcotagDelete") ?? "Data Source=.db/EcotagDelete.db";
            services.AddSqlite<DeleteContext>(connectionString);
            services.AddScoped<IDeleteRepository, DeleteSqlLiteRepository>();
        }
        else
        {
            services.AddDbContext<ProjectContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
            services.AddDbContext<DeleteContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
            services.AddScoped<IDeleteRepository, DeleteRepository>();
        }
    

        services.AddScoped<ProjectsRepository, ProjectsRepository>();
        services.AddScoped<DatasetsRepository, DatasetsRepository>();
        services.AddScoped<CreateProjectCmd, CreateProjectCmd>();
        services.AddScoped<GetAllProjectsCmd, GetAllProjectsCmd>();
        services.AddScoped<GetProjectCmd, GetProjectCmd>();
        services.AddScoped<GetProjectDatasetCmd, GetProjectDatasetCmd>();
        services.AddScoped<GetProjectFileCmd, GetProjectFileCmd>();
        services.AddScoped<ReserveCmd, ReserveCmd>();
        services.AddScoped<SaveAnnotationCmd, SaveAnnotationCmd>();
        services.AddScoped<GetAnnotationsStatusCmd, GetAnnotationsStatusCmd>();
        services.AddScoped<ExportCmd, ExportCmd>();
        services.AddScoped<ExportThenDeleteProjectCmd, ExportThenDeleteProjectCmd>();
    }
}