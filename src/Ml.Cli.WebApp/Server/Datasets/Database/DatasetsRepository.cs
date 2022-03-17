using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Ml.Cli.WebApp.Server.Datasets.Cmd;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetsRepository {
    private readonly DatasetContext _datasetsContext;
    public const string AlreadyTakenName = "AlreadyTakenName";

    public DatasetsRepository(DatasetContext datasetsContext)
    {
        _datasetsContext = datasetsContext;
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var groupModel = new DatasetModel()
        {
            Name = createDataset.Name,
            Classification = createDataset.Classification.ToDatasetClassification(),
            Type = createDataset.Type.ToDatasetType(),
            CreateDate = DateTime.Now.Ticks,
            GroupId = Guid.Parse(createDataset.GroupId),
            CreatorNameIdentifier = createDataset.CreatorNameIdentifier
        };
        var result = Groups.Database.Group.DbSetExtension.AddIfNotExists(_datasetsContext.Datasets, groupModel, group => group.Name == groupModel.Name);
        if (result == null)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        try
        {
            await _datasetsContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            commandResult.Error = new ErrorResult { Key = AlreadyTakenName };
            return commandResult;
        }
        commandResult.Data = groupModel.Id.ToString();
        return commandResult;
    }
    
    public async Task<IList<ListDataset>> ListDatasetAsync(bool? locked, IList<string> groupIds)
    {
        IList<DatasetModel> datasets;
        if (locked.HasValue)
        {
            datasets = await _datasetsContext.Datasets.AsNoTracking().Where(dataset => dataset.IsLocked == locked && groupIds.Contains(dataset.GroupId.ToString())).Include(dataset => dataset.Files).ToListAsync();
        }
        else
        {
            datasets = await _datasetsContext.Datasets.AsNoTracking().Where(dataset => groupIds.Contains(dataset.GroupId.ToString())).Include(dataset => dataset.Files).ToListAsync();
        }
        
        return datasets.Select(d => d.ToListDatasetResult()).ToList();
    }
    
    public async Task<GetDataset> GetDatasetAsync(string datasetId)
    {
        var dataset = await _datasetsContext.Datasets.AsNoTracking()
            .Where(dataset => dataset.Id == new Guid(datasetId))
            .Include(dataset => dataset.Files)
            .FirstOrDefaultAsync();
        return dataset?.ToGetDataset();
    }
    
    public async Task<GetDatasetInfo> GetDatasetInfoAsync(string datasetId)
    {
        var dataset = await _datasetsContext.Datasets.AsNoTracking()
            .Where(dataset => dataset.Id == new Guid(datasetId))
            .FirstOrDefaultAsync();
        return dataset?.ToGetDatasetInfo();
    }
    
    public async Task<string> CreateFileAsync(string datasetId, string fileName, string contentType, long size, string creatorNameIdentifier)
    {
        var dataset = await _datasetsContext.Datasets
            .Where(dataset => dataset.Id == new Guid(datasetId))
            .FirstOrDefaultAsync();

        var file = new FileModel()
        {
            Name = fileName,
            ContentType = contentType,
            CreatorNameIdentifier = creatorNameIdentifier,
            CreateDate = DateTime.Now.Ticks,
            Size = size
        };
        dataset.Files.Add(file);

        await _datasetsContext.SaveChangesAsync();
        
        return file.Id.ToString();
    }

}