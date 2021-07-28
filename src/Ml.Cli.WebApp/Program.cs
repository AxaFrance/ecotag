using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ml.Cli.WebApp.BasePath;

namespace Ml.Cli.WebApp
{
    public static class Program
    {
        public static async Task Main(string[] args)
        {
            if (!args[0].EndsWith(Path.DirectorySeparatorChar))
            {
                args[0] += Path.DirectorySeparatorChar;
            }
            var builder = CreateHostBuilder(args).Build();
            await builder.RunAsync();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); })
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddSingleton<IHostedService>(provider =>
                    new Worker(args.Skip(1).ToArray()));
                    services.AddSingleton<IBasePath, BasePath.BasePath>(provider => new BasePath.BasePath(args[0]));
                });
    }
}
