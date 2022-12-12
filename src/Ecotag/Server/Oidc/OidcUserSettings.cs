using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace AxaGuilDEv.Ecotag.Server.Oidc;

[ExcludeFromCodeCoverage]
public class OidcUserSettings
{
    public const string OidcUser = "OidcUser";
    public string RequireAudience { get; set; }
    public IList<string> RequireScopes { get; set; }
}