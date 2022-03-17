using System.Threading.Tasks;
using Ml.Cli.WebApp.Server.Datasets.Database;

namespace Ml.Cli.WebApp.Server.Datasets.Cmd;

public class GetDatasetCmd
{
    private readonly DatasetsRepository _datasetsRepository;

    public GetDatasetCmd(DatasetsRepository datasetsRepository)
    {
        _datasetsRepository = datasetsRepository;
    }
    
    public async Task<GetDataset> ExecuteAsync(string datasetId)
    {
        var getDataset = await _datasetsRepository.GetDatasetAsync(datasetId);
        return getDataset;
    }
}