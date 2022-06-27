using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class ImportDatasetFilesService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly IMemoryCache _cache;

    public ImportDatasetFilesService(IServiceScopeFactory serviceScopeFactory, IMemoryCache cache)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _cache = cache;
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
                await ImportDatasetFilesAsync(fileService, datasetContext, _cache, importedDatasetName ,datasetId, datasetType, creatorNameIdentifier);
            }
            catch (Exception exception)
            {
                logger?.LogError(exception, "Error while importing dataset from blob");
            }
        });
    }

    private static async Task ImportDatasetFilesAsync(IFileService fileService, DatasetContext datasetContext, IMemoryCache cache, string importedDatasetName, string datasetId, DatasetTypeEnumeration datasetType, string creatorNameIdentifier)
    {
        var filesResult = await fileService.GetInputDatasetFilesAsync(
            $"azureblob://TransferFileStorage/input/{importedDatasetName}", datasetType.ToString());
        var successFiles = filesResult
            .Where(x => x.Value.IsSuccess).Where(f => FileValidator.IsFileExtensionValid(f.Key, datasetType.ToString()) && FileValidator.IsFileSizeValid(f.Value.Data.Length)).ToList();
        
        await datasetContext.Files.AddRangeAsync(successFiles.Select(x => new FileModel
        {
            Name = x.Key,
            ContentType = x.Value.Data.ContentType,
            CreatorNameIdentifier = creatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = x.Value.Data.Length,
            DatasetId = Guid.Parse(datasetId)
        }));

        var locked = DatasetLockedEnumeration.Locked;
        if (datasetType == DatasetTypeEnumeration.Document)
        {
            var isContainFileToConvertPdf = successFiles.Count(sf =>
                DatasetsRepository.ExtentionsConvertedToPdf.Contains(Path.GetExtension(sf.Key))) != 0;
            if (isContainFileToConvertPdf)
            {
                locked = DatasetLockedEnumeration.LockedAndWorkInProgress;
            }
        }
        
        var datsetModel = await datasetContext.Datasets.Where(d => d.Id == Guid.Parse(datasetId)).FirstAsync();
        datsetModel.Locked = locked;
        await datasetContext.SaveChangesAsync();
        cache.Remove($"GetDatasetInfoAsync({datasetId})");
    }
}