using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ml.Cli.WebApp.BasePath;

namespace Ml.Cli.WebApp
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var app = new CommandLineApplication()
            {
                Name = "Ml.Cli",
                FullName = "Ml-Cli",
                Description =
                    "Ml-Cli is an open-source, local tool that automates Machine Learning actions such as quality tests on services, dataset creation and annotation."
            };
            app.HelpOption("-?|-h|--help");

            var basePath = app.Option("-b|--base-path <VALUE>",
                "[Required] - Defines the default base directory used by the paths inside your task.json file.",
                CommandOptionType.SingleValue);
            var tasksPath = app.Option("-t|--tasks-path <VALUE>",
                "[Optional] - Defines the path of the tasks.json file, which describes the tasks to execute.",
                CommandOptionType.SingleValue);
            var securityPath = app.Option("-s|--security-path <VALUE>",
                "[Optional] - Defines the security directory path. ML-Cli has only access to files inside this directory. If not provided, the security path will be the same as the base directory path.",
                CommandOptionType.SingleValue);

            app.OnExecute(async () =>
            {
                var tasksValue = tasksPath.Value();
                var baseValue = basePath.Value();
                if (baseValue == null)
                {
                    Console.WriteLine("The base path argument is unspecified.");
                    app.ShowHelp();
                    return -1;
                }

                var securityValue = securityPath.Value() == null ? baseValue : securityPath.Value();
                if (!securityValue.EndsWith(Path.DirectorySeparatorChar))
                {
                    securityValue += Path.DirectorySeparatorChar;
                }

                var providedArgs = new[]
                {
                    securityValue,
                    tasksValue ?? "",
                    baseValue
                };
                var builder = CreateHostBuilder(providedArgs).Build();
                await builder.RunAsync();
                return 0;
            });
            try
            {
                app.Execute(args);
            }
            catch (CommandParsingException ex)
            {
                Console.WriteLine(ex.Message);
                app.ShowHelp();
            }
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