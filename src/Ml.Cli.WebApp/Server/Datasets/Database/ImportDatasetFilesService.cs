using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Ml.Cli.WebApp.Server.Datasets.Database.FileStorage;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class ImportDatasetFilesService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public ImportDatasetFilesService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task ImportFiles(CreateDataset createDataset, DatasetModel datasetModel)
    {
        await Task.Run(async () =>
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var serviceProvider = scope.ServiceProvider;
            var fileService = (IFileService)serviceProvider.GetService(typeof(IFileService));
            var datasetContext = (DatasetContext)serviceProvider.GetService(typeof(DatasetContext));
            await ImportDatasetFiles(fileService, datasetContext, createDataset, datasetModel);
        });
    }

    public async Task ImportDatasetFiles(IFileService fileService, DatasetContext datasetContext, CreateDataset createDataset, DatasetModel datasetModel)
    {
        var filesResult = await fileService.GetInputDatasetFilesAsync("TransferFileStorage", "input",
            createDataset.ImportedDatasetName, datasetModel.Type.ToString());
        var successFiles = filesResult
            .Where(x => x.Value.IsSuccess).ToList();
        datasetContext.Files.AddRange(successFiles.Select(x => new FileModel
        {
            Name = x.Value.Data.Name,
            ContentType = x.Value.Data.ContentType,
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = x.Value.Data.Length,
            DatasetId = datasetModel.Id
        }));
        try
        {
            await datasetContext.SaveChangesAsync();
        }
        catch (Exception)
        {
            // ignored
        }
    }
}