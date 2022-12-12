using System;

namespace Ml.Cli.WebApp.Server;

public interface IDateTime
{
    DateTime Now { get; }
}