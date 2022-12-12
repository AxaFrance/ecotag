using System.Diagnostics.CodeAnalysis;

namespace AxaGuilDEv.Ecotag.Server;

[ExcludeFromCodeCoverage]
public class DatabaseSettings
{
    public string Mode { get; set; }
    public static string Database { get; set; } = "Database";
}