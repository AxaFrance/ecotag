namespace Ml.Cli.WebApp.Server.Oidc
{
    public class OidcSettings
    {
        public const string Oidc = "Oidc";
        public string ProxyUrl { get; set; }
        public string Authority { get; set; }
        public bool RequireHttpsMetadata { get; set; }
    }
}