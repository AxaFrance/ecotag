using System.Text.Json.Serialization;

namespace Ml.Cli.WebApp.Server.Groups.Oidc
{
    public class OidcConfiguration
    {
        [JsonPropertyName("userinfo_endpoint")]
        public string UserinfoEndpoint { get; set; }
    }
}