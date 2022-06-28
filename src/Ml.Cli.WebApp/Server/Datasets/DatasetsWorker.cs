using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ml.Cli.WebApp.Server.Datasets.Database;

namespace Ml.Cli.WebApp.Server.Datasets;

public class DatasetsWorker : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<DatasetsWorker> _logger;

    public DatasetsWorker(IServiceProvider services, 
        ILogger<DatasetsWorker> logger)
    {
        _services = services;
        _logger = logger;
    }


    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (stoppingToken.IsCancellationRequested == false)
        {
            await Task.Delay(5000);
            try
            {
                using var scope = _services.CreateScope();
                var datasetsRepository =
                    scope.ServiceProvider
                        .GetRequiredService<DatasetsRepository>();
                var datasetsConvertRepository =
                    scope.ServiceProvider
                        .GetRequiredService<DatasetsConvertRepository>();
                

                var datasets = await datasetsRepository.ListDatasetAsync(new List<DatasetLockedEnumeration>()
                {
                    DatasetLockedEnumeration.LockedAndWorkInProgress
                });

                var datasetOrdered = datasets.OrderByDescending(d => d.CreateDate).ToList();
                for (var i = 0; i < datasetOrdered.Count(); i++)
                {
                    var dataset = datasetOrdered[i];
                    try
                    {
                        await datasetsConvertRepository.ConvertFileToPdfAsync(dataset.Id);
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e, "DatasetsWorker error");
                    }

                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "DatasetsWorker global error");
            }
        }
    }

}