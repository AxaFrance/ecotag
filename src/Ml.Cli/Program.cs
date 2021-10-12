using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ml.Cli.FileLoader;
using Ml.Cli.InputTask;
using Ml.Cli.JobApiCall;
using Ml.Cli.JobApiCall.FileHandler;
using Ml.Cli.JobCompare;
using Ml.Cli.JobDataset;
using Ml.Cli.JobLoop;
using Ml.Cli.JobParallel;
using Ml.Cli.JobScript;
using Ml.Cli.JobSerial;
using Ml.Cli.JobVersion;
using Ml.Cli.PathManager;
using Newtonsoft.Json;
using Version = Ml.Cli.JobVersion.Version;

[assembly:CLSCompliant(true)]
namespace Ml.Cli
{
    public partial class Program
    {
        public static void Main(string[] args)
        {
            var app = new CommandLineApplication()
            {
                Name = "Ml.Cli",
                FullName = "Ml-Cli-Batch",
                Description = "Ml-Cli is an open-source, local tool that automates Machine Learning actions such as quality tests on services, dataset creation and annotation."
            };
            app.HelpOption("-?|-h|--help");
            var basePath = app.Option("-b|--base-path <VALUE>",
                "[Required] - Defines the default base directory used by the paths inside your task.json file.",
                CommandOptionType.SingleValue);
            var tasksPath = app.Option("-t|--tasks-path <VALUE>",
                "[Optional] - Defines the path of the tasks.json file, which describes the tasks to execute.",
                CommandOptionType.SingleValue);

            app.OnExecute(async () =>
            {
                var tasksValue = tasksPath.Value();
                var baseValue = basePath.Value();

                var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                IConfiguration configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddEnvironmentVariables()
                    .AddJsonFile("appsettings.json", false, true)
                    .AddJsonFile($"appsettings.{environmentName}.json", true, true)
                    .Build();

                var applicationName = configuration.GetValue<string>("Application:Name");
                var applicationMessage = configuration.GetValue<string>("Application:Message");
        
                var services = new ServiceCollection();
                ConfigureServices(services);

                await using var tempServiceProvider = services.BuildServiceProvider();
                var logger = tempServiceProvider.GetService<ILogger<Program>>();
                services.AddSingleton(typeof(ILogger), logger);
                await using var serviceProvider = services.BuildServiceProvider();

                logger.LogInformation($"Application Name: {applicationName}");
                logger.LogInformation($"Application Message: {applicationMessage}");
                
                var providedArgs = new[]
                {
                    tasksValue,
                    baseValue
                };
                var program = new Program();
                await program.Run(providedArgs[0], providedArgs[1], serviceProvider, services);
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

        private static void ConfigureServices(ServiceCollection services)
        {
            services.AddLogging(logging => logging.AddConsole());
            services.AddHttpClient("Default").ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
            {
                DefaultProxyCredentials = CredentialCache.DefaultCredentials
            });
    
            services.AddSingleton<IFileLoader, FileLoader.FileLoader>();
            services.AddSingleton<IFileHandler, FileHandler>();

            services.AddSingleton<TaskApiCall>();
            services.AddSingleton<ApiCallFiles>();
            services.AddSingleton<TaskCompare>();
            services.AddSingleton<TaskDataset>();
            services.AddSingleton<TaskScript>();
            services.AddSingleton<Version>();
            services.AddSingleton<TaskParallel>();
            services.AddSingleton<TaskSerial>();
            services.AddSingleton<TaskLoop>();

            services.AddSingleton<IInputTask, TasksGroup>();
            services.AddSingleton<IInputTask, LoopTask>();
            services.AddSingleton<IInputTask, Callapi>();
            services.AddSingleton<IInputTask, CompareTask>();
            services.AddSingleton<IInputTask, DatasetTask>();
            services.AddSingleton<IInputTask, ScriptTask>();
            services.AddSingleton<IInputTask, VersionTask>();
        }

        private async Task Run(string path, string baseDirectory, ServiceProvider provider, ServiceCollection services)
        {
            var logger = provider.GetService<ILogger<Program>>();
            var fileLoader = provider.GetService<IFileLoader>();
        
            try
            {
                var pathValidatorHelper = new PathValidatorHelper();
                var inputTasks = JsonConvert.DeserializeObject<List<IInputTask>>(await fileLoader.ReadAllTextInFileAsync(path), new InputTaskItemFactory(baseDirectory, logger, services, pathValidatorHelper));
                var newProvider = services.BuildServiceProvider();
                await RunTasksAsync(newProvider, inputTasks, logger);
            }
            catch (Exception ex)
            {
                logger.LogError($"Exception: {ex.Message}");
            }
        }

        private static async Task RunTasksAsync(ServiceProvider provider, List<IInputTask> inputTasks, ILogger<Program> logger)
        {
            try
            {
                foreach (var task in inputTasks)
                {
                    await RunTaskAsync(provider, logger, task);
                }
            }
            catch (Exception e)
            {
                logger.LogError($"Exception: {e.Message}");
            }
        }

        private static async Task RunTaskAsync(IServiceProvider provider, ILogger<Program> logger, IInputTask task)
        {
            if (!task.Enabled)
            {
                logger.LogInformation($"Task Id: {task.Id} - Task skipped: enabled attribute is 'false'");
                return;
            }
            logger.LogInformation($"Task Id: {task.Id} - Starting {task.Type}");
            
            Task LocalRunTaskAsync(IInputTask inputTask)
            {
                return RunTaskAsync(provider, logger, inputTask);
            }
            
            switch (task.Type)
            {
                case "wait_version_change":
                    await provider.GetService<Version>()?.WaitVersionChange((VersionTask) task);
                    break;
                case "parallel":
                    //no await required
                    provider.GetService<TaskParallel>().ParallelExecution(task, LocalRunTaskAsync);
                    break;
                case "serial":
                    await provider.GetService<TaskSerial>().SerialExecution(task, LocalRunTaskAsync);
                    break;
                case "loop":
                    await provider.GetService<TaskLoop>().LoopExecution(task, LocalRunTaskAsync);
                    break;
                case "callapi":
                    await provider.GetService<TaskApiCall>().ApiCallAsync((Callapi)task);
                    break;
                case "compare":
                    await provider.GetService<TaskCompare>().CompareAsync((CompareTask)task);
                    break;
                case "script":
                    await provider.GetService<TaskScript>().FormatCallapiAsync((ScriptTask) task);
                    break;
                case "dataset":
                    await provider.GetService<TaskDataset>().GenerateDatasetAsync((DatasetTask) task);
                    break;
                default:
                    throw new Exception($"Task Id: {task.Id} - Task type doesn't exist");
            }
        }
    }
}