using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server;
[ExcludeFromCodeCoverage]
public class DatabaseMode
{
    public const string SqlServer = "SqlServer";
    public const string Sqlite = "Sqlite";
}