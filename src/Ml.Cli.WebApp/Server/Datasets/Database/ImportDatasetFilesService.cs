using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class ImportDatasetFilesService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public ImportDatasetFilesService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task ImportFilesAsync(CreateDataset createDataset, DatasetModel datasetModel)
    {
        await Task.Run(async () =>
        {   
            using var scope = _serviceScopeFactory.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var fileService = (IFileService)serviceProvider.GetService(typeof(IFileService));
            var datasetContext = (DatasetContext)serviceProvider.GetService(typeof(DatasetContext));
            var logger = (ILogger<ImportDatasetFilesService>)serviceProvider.GetService(typeof(ILogger<ImportDatasetFilesService>));
            try
            {
                await ImportDatasetFilesAsync(fileService, datasetContext, createDataset, datasetModel);
            }
            catch (Exception exception)
            {
                logger?.LogError(exception, "Error while importing dataset from blob");
            }
        });
    }

    private static async Task ImportDatasetFilesAsync(IFileService fileService, DatasetContext datasetContext, CreateDataset createDataset, DatasetModel datasetModel)
    {
        var filesResult = await fileService.GetInputDatasetFilesAsync(
            $"azureblob://TransferFileStorage/input/{createDataset.ImportedDatasetName}", datasetModel.Type.ToString());
        var successFiles = filesResult
            .Where(x => x.Value.IsSuccess).ToList();
        datasetContext.Files.AddRange(successFiles.Select(x => new FileModel
        {
            Name = x.Key,
            ContentType = x.Value.Data.ContentType,
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = x.Value.Data.Length,
            DatasetId = datasetModel.Id
        }));
        await datasetContext.SaveChangesAsync();
    }
}