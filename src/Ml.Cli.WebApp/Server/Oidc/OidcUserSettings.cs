using System.Collections.Generic;

namespace Ml.Cli.WebApp.Server.Oidc
{
    public class OidcUserSettings
    {
        public string RequireAudience { get; set; }
        public IList<string> RequireScopes { get; set; }
        public const string OidcUser = "OidcUser";
    }
}