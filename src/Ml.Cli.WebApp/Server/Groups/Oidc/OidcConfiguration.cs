using System.Diagnostics.CodeAnalysis;
using System.Text.Json.Serialization;

namespace Ml.Cli.WebApp.Server.Groups.Oidc
{
    [ExcludeFromCodeCoverage]
    public class OidcConfiguration
    {
        [JsonPropertyName("userinfo_endpoint")]
        public string UserinfoEndpoint { get; set; }
    }
}