using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server;
[ExcludeFromCodeCoverage]
public class DatabaseMode
{
    public static string Mode { get; set; } = "Database:Mode";
    public const string SqlServer = "SqlServer";
    public const string Sqlite = "Sqlite";
}