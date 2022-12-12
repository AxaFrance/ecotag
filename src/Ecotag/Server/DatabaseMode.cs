using System.Diagnostics.CodeAnalysis;

namespace AxaGuilDEv.Ecotag.Server;

[ExcludeFromCodeCoverage]
public class DatabaseMode
{
    public const string SqlServer = "SqlServer";
    public const string Sqlite = "Sqlite";
    public static string Mode { get; set; } = "Database:Mode";
}