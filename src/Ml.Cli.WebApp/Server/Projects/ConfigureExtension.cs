using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Projects.Cmd;
using Ml.Cli.WebApp.Server.Projects.Database;
using Ml.Cli.WebApp.Server.Projects.Database.Project;

namespace Ml.Cli.WebApp.Server.Projects;

public static class ConfigureExtension
{
    public static void ConfigureProjects(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ProjectContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        services.AddScoped<IProjectsRepository, ProjectsRepository>();
        services.AddScoped<CreateProjectCmd, CreateProjectCmd>();
        services.AddScoped<GetAllProjectsCmd, GetAllProjectsCmd>();
        services.AddScoped<GetProjectCmd, GetProjectCmd>();
        services.AddScoped<GetProjectDatasetCmd, GetProjectDatasetCmd>();
        services.AddScoped<GetProjectFileCmd, GetProjectFileCmd>();
        services.AddScoped<ReserveCmd, ReserveCmd>();
    }
}