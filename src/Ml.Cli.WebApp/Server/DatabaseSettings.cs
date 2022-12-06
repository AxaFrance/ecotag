using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server;

[ExcludeFromCodeCoverage]
public static class DatabaseSettings
{
    public static string Mode { get; set; } = "Database:Mode";
}