using System.Diagnostics.CodeAnalysis;

namespace AxaGuilDEv.Ecotag.Server.Oidc;

[ExcludeFromCodeCoverage]
public class OidcSettings
{
    public const string Oidc = "Oidc";
    public string ProxyUrl { get; set; }
    public string Authority { get; set; }
    public bool RequireHttpsMetadata { get; set; }
}