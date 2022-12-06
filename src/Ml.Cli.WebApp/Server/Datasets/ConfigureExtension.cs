using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Datasets.Cmd;
using Ml.Cli.WebApp.Server.Datasets.Database;
using Ml.Cli.WebApp.Server.Datasets.Database.Annotations;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;
using Ml.Cli.WebApp.Server.Projects.Cmd;

namespace Ml.Cli.WebApp.Server.Datasets;

[ExcludeFromCodeCoverage]
public static class ConfigureExtension
{
    public static void ConfigureDatasets(this IServiceCollection services, IConfiguration configuration)
    {
        var databaseMode = configuration[DatabaseSettings.Mode];
        if (databaseMode == DatabaseMode.Sqlite) {
            services.AddScoped<IFileService, FileHardDriveService>();
            var connectionString = configuration.GetConnectionString("EcotagDatatset") ?? "Data Source=.db/EcotagDatatset.db";
            services.AddSqlite<DatasetContext>(connectionString);
        }
        else
        {
            services.AddScoped<IFileService, FileBlobService>();
            services.AddDbContext<DatasetContext>(options =>
              options.UseSqlServer(configuration.GetConnectionString("ECOTAGContext")));
        }
        
        services.Configure<DatasetsSettings>(
            configuration.GetSection(DatasetsSettings.Datasets));
        services.AddScoped<DatasetsRepository, DatasetsRepository>();
        services.AddScoped<CreateDatasetCmd, CreateDatasetCmd>();
        services.AddScoped<ListDatasetCmd, ListDatasetCmd>();
        services.AddScoped<UploadFileCmd, UploadFileCmd>();
        services.AddScoped<GetDatasetCmd, GetDatasetCmd>();
        services.AddScoped<GetFileCmd, GetFileCmd>();
        services.AddScoped<LockDatasetCmd, LockDatasetCmd>();
        services.AddScoped<DeleteFileCmd, DeleteFileCmd>();
        services.AddScoped<GetImportedDatasetsCmd, GetImportedDatasetsCmd>();
        services.AddScoped<AnnotationsRepository, AnnotationsRepository>();
        services.AddScoped<ImportDatasetFilesService, ImportDatasetFilesService>();
        services.AddScoped<DocumentConverterToPdf, DocumentConverterToPdf>();
        services.AddScoped<DatasetsConvertRepository, DatasetsConvertRepository>();
    }
}