﻿using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace Ml.Cli.WebApp
{
    public class Worker : BackgroundService
    {
        private readonly string[] _args;

        public Worker(string[] args)
        {
            _args = args;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Ml.Cli.Program.Main(_args);
        }
    }
}