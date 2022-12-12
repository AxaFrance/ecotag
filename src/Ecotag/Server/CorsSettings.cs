using System.Diagnostics.CodeAnalysis;

namespace AxaGuilDEv.Ecotag.Server;

[ExcludeFromCodeCoverage]
public class CorsSettings
{
    public const string Cors = "Cors";
    public string Origins { get; set; }
}