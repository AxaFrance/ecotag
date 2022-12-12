using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server;

[ExcludeFromCodeCoverage]
public class DatabaseSettings
{
    public string Mode { get; set; }
    public static string Database { get; set; } = "Database";
}