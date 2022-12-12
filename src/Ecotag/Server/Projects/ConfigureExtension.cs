using System.Diagnostics.CodeAnalysis;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd;
using AxaGuilDEv.Ecotag.Server.Projects.Cmd.Annotations;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AxaGuilDEv.Ecotag.Server.Projects;

[ExcludeFromCodeCoverage]
public static class ConfigureExtension
{
    public static void ConfigureProjects(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseSettings = configuration.GetSection(DatabaseSettings.Database).Get<DatabaseSettings>();
        if (databaseSettings.Mode == DatabaseMode.Sqlite)
        {
            var connectionStringProject =
                configuration.GetConnectionString("EcotagProject") ?? "Data Source=.db/EcotagProject.db";
            services.AddSqlite<ProjectContext>(connectionStringProject);
        }
        else
        {
            services.AddDbContext<ProjectContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        }

        services.AddScoped<IDeleteRepository, DeleteRepository>();

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