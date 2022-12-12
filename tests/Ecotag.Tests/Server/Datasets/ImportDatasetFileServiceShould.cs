using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Datasets.Database.FileStorage;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Datasets;

public class ImportDatasetFileServiceShould
{
    [Fact]
    public async Task Should_Import_Files()
    {
        var (createDataset, datasetContext, datasetModel, importDatasetFileService) = InitMockAsync();
        await importDatasetFileService.ImportFilesAsync(createDataset.ImportedDatasetName, datasetModel.Id.ToString(), datasetModel.Type, datasetModel.CreatorNameIdentifier);
    }

    private static (CreateDataset createDataset, DatasetContext datasetContext, DatasetModel datasetModel, ImportDatasetFilesService importDatasetFileService) InitMockAsync()
    {
        var filesDict = new Dictionary<string, ResultWithError<FileInfoServiceDataModel, ErrorResult>>
        {
            {
                "firstFile.txt",
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                    { Error = new ErrorResult { Key = FileBlobService.InvalidFileExtension } }
            },
            {
                "secondFile.txt",
                new ResultWithError<FileInfoServiceDataModel, ErrorResult>
                {
                    Data = new FileInfoServiceDataModel
                        { Name = "secondFile.txt", Length = 10, ContentType = "image" }
                }
            },
            { "thirdFile.txt", new ResultWithError<FileInfoServiceDataModel, ErrorResult>{Error = new ErrorResult{Key = FileBlobService.InvalidFileExtension}} }
        };
        var fileService = new Mock<IFileService>();
        fileService
            .Setup(foo =>
                foo.GetInputDatasetFilesAsync("azureblob://TransferFileStorage/input/groupName/datasetName", It.IsAny<string>()))
            .ReturnsAsync(filesDict);
        var datasetContext = DatasetMock.GetInMemoryDatasetContext()();

        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider
            .Setup(foo =>
                foo.GetService(typeof(IFileService))
            ).Returns(fileService.Object);
        serviceProvider
            .Setup(foo =>
                foo.GetService(typeof(DatasetContext))
            ).Returns(datasetContext);

        var serviceScope = new Mock<IServiceScope>();
        serviceScope.Setup(foo => foo.ServiceProvider).Returns(serviceProvider.Object);
        
        var serviceScopeFactory = new Mock<IServiceScopeFactory>();
        serviceScopeFactory.Setup(foo => foo.CreateScope()).Returns(serviceScope.Object);
        
        var createDataset = new CreateDataset
        {
            CreatorNameIdentifier = "s666666",
            ImportedDatasetName = "groupName/datasetName"
        };
        var datasetModel = new DatasetModel
        {
            Id = new Guid(),
            Type = DatasetTypeEnumeration.Image,
        };
        var memoryCache = new MemoryCache(Options.Create(new MemoryCacheOptions()));
        var importDatasetFileService = new ImportDatasetFilesService(serviceScopeFactory.Object, memoryCache);
        return (createDataset, datasetContext, datasetModel, importDatasetFileService);
    }
}