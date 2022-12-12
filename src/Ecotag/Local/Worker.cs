using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace AxaGuilDEv.Ecotag.Local;

public class Worker : BackgroundService
{
    private readonly string[] _args;

    public Worker(string[] args)
    {
        _args = args;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (_args[0] != string.Empty) MlCli.Program.Main(_args, "appsettings-local");
    }
}