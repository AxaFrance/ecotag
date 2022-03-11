using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Ml.Cli.WebApp.Server.Datasets.Database;

public class DatasetsRepository {
    private readonly DatasetContext _datasetsContext;
    private const string AlreadyTakenName = "AlreadyTakenName";

    public DatasetsRepository(DatasetContext datasetsContext)
    {
        _datasetsContext = datasetsContext;
    }

    private DatasetTypeEnumeration ToDatasetType(string type)
    {
        return type switch
        {
            nameof(DatasetTypeEnumeration.Image) => DatasetTypeEnumeration.Image,
            _ => DatasetTypeEnumeration.Text
        };
    }

    private DatasetClassificationEnumeration ToDatasetClassification(string type)
    {
        return type switch
        {
            nameof(DatasetClassificationEnumeration.Public) => DatasetClassificationEnumeration.Public,
            nameof(DatasetClassificationEnumeration.Internal) => DatasetClassificationEnumeration.Internal,
            nameof(DatasetClassificationEnumeration.Confidential) => DatasetClassificationEnumeration.Confidential,
            _ => DatasetClassificationEnumeration.Critical
        };
    }

    public async Task<ResultWithError<string, ErrorResult>> CreateDatasetAsync(CreateDataset createDataset)
    {
        var commandResult = new ResultWithError<string, ErrorResult>();
        var groupModel = new DatasetModel()
        {
            Name = createDataset.Name,
            Classification = ToDatasetClassification(createDataset.Classification),
            Type = ToDatasetType(createDataset.Type),
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

}