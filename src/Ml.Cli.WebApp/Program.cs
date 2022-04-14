using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Ml.Cli.PathManager;
using Ml.Cli.WebApp.Local;
using Ml.Cli.WebApp.Local.Paths;
using Ml.Cli.WebApp.Server;
using Serilog;

namespace Ml.Cli.WebApp
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                var builder = CreateHostBuilderServer(args).Build();
                var task = builder.RunAsync();
                task.Wait();
                return;
            }

            var app = new CommandLineApplication()
            {
                Name = "Ml.Cli",
                FullName = "Ml-Cli-WebApp",
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
            var comparesPaths = app.Option("-c|--compares-paths <VALUE>",
                "[Optional] - Defines the repositories that contain comparison files that you can download and read from the webapp. To provide several repositories, please read the following example: '-c repository1,repository2'. The compares paths can be relative, and will be completed by using the base directory path. Please note that if 'No file found' appears on the webapp page but you provided compare paths, it probably means that the 'base directory path'/'compare path' combination provided an incorrect path. It can also mean that the provided paths are not in the repository specified by the security path, as it is mandatory.",
                CommandOptionType.SingleValue);
            var datasetsPaths = app.Option("-d|--datasets-paths <VALUE>",
                "[Optional] - Defines the repositories that contain datasets files that you can download and read from the webapp. To provide several repositories, please read the following example: '-d repository1,repository2'. The datasets paths can be relative, and will be completed by using the base directory path. Please note that if 'No file found' appears on the webapp page but you provided datasets paths, it probably means that the 'base directory path'/'dataset path' combination provided an incorrect path. It can also mean that the provided paths are not in the repository specified by the security path, as it is mandatory.",
                CommandOptionType.SingleValue);
            
            app.OnExecute(async () =>
            {

                var tasksValue = PathAdapter.AdaptPathForCurrentOs(tasksPath.Value());
                var baseValue = PathAdapter.AdaptPathForCurrentOs(basePath.Value());
                var comparesValue = PathAdapter.AdaptPathForCurrentOs(comparesPaths.Value());
                var datasetsValue = PathAdapter.AdaptPathForCurrentOs(datasetsPaths.Value());
                if (baseValue == null)
                {
                    Console.WriteLine("The base path argument is unspecified.");
                    app.ShowHelp();
                    return -1;
                }

                var securityValue = securityPath.Value()?? baseValue;
                if (!securityValue.EndsWith(Path.DirectorySeparatorChar))
                {
                    securityValue += Path.DirectorySeparatorChar;
                }

                var providedArgs = new[]
                {
                    "-s",
                    securityValue,
                    "-c",
                    comparesValue ?? string.Empty,
                    "-d",
                    datasetsValue ?? string.Empty,
                    "-t",
                    tasksValue ?? string.Empty,
                    "-b",
                    baseValue
                };
                
                var builder = CreateHostBuilderLocal(providedArgs).Build();
                await builder.RunAsync();
                return 1;
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

        private static IHostBuilder CreateHostBuilderServer(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    var env = builderContext.HostingEnvironment;
                    config.AddJsonFile($"appsettings-server.json", false, true)
                        .AddJsonFile($"appsettings-server.{env.EnvironmentName}.json", true, true)
                        .AddJsonFile($"appsettings-server.{env.EnvironmentName}Custom.json", true, true);
                    config.AddEnvironmentVariables();
                }).ConfigureAppConfiguration((context, config) =>
                {
                    if (!context.HostingEnvironment.IsDevelopment()) {
                        var builtConfig = config.Build();
                        var keyVaultConfigBuilder = new ConfigurationBuilder();
                        keyVaultConfigBuilder.AddAzureKeyVault(new Uri(builtConfig["KeyVault:BaseUrl"]), new DefaultAzureCredential());
                        var keyVaultConfig = keyVaultConfigBuilder.Build();
                        config.AddConfiguration(keyVaultConfig);
                    }
                })
                .UseSerilog((context, logger) => { logger.ReadFrom.Configuration(context.Configuration); })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseContentRoot(Directory.GetCurrentDirectory());
                    webBuilder.UseIISIntegration();
                    webBuilder.UseStartup<StartupServer>();
                });

        private static IHostBuilder CreateHostBuilderLocal(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((builderContext, config) =>
                {
                    var env = builderContext.HostingEnvironment;
                    config.AddJsonFile($"appsettings-local.json", false, true)
                        .AddJsonFile($"appsettings-local.{env.EnvironmentName}.json", true, true);
                    config.AddEnvironmentVariables();
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<StartupLocal>();
                })
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddSingleton(provider => new BasePath(args[1]));
                    services.AddSingleton(provider => new ComparesPaths(args[3]));
                    services.AddSingleton(provider => new DatasetsPaths(args[5]));
                    if (args[7] == string.Empty) return;
                    services.AddSingleton<IHostedService>(provider =>
                        new Worker(args.Skip(6).ToArray()));
                });
    }
}