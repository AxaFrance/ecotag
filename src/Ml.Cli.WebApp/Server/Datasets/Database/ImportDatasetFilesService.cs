using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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

    public async Task ImportFilesAsync(string importedDatasetName,  string datasetId, DatasetTypeEnumeration datasetType, string creatorNameIdentifier)
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
                await ImportDatasetFilesAsync(fileService, datasetContext,importedDatasetName ,datasetId, datasetType, creatorNameIdentifier);
            }
            catch (Exception exception)
            {
                logger?.LogError(exception, "Error while importing dataset from blob");
            }
        });
    }

    private static async Task ImportDatasetFilesAsync(IFileService fileService, DatasetContext datasetContext, string importedDatasetName, string datasetId, DatasetTypeEnumeration datasetType, string creatorNameIdentifier)
    {
        var filesResult = await fileService.GetInputDatasetFilesAsync(
            $"azureblob://TransferFileStorage/input/{importedDatasetName}", datasetType.ToString());
        var successFiles = filesResult
            .Where(x => x.Value.IsSuccess).ToList();
        await datasetContext.Files.AddRangeAsync(successFiles.Select(x => new FileModel
        {
            Name = x.Key,
            ContentType = x.Value.Data.ContentType,
            CreatorNameIdentifier = creatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = x.Value.Data.Length,
            DatasetId = Guid.Parse(datasetId)
        }));
        var datsetModel = await datasetContext.Datasets.Where(d => d.Id == Guid.Parse(datasetId)).FirstAsync();
        datsetModel.Locked = DatasetLockedEnumeration.Locked;
        await datasetContext.SaveChangesAsync();
    }
}