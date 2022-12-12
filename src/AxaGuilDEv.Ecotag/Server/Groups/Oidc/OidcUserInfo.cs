using System.Diagnostics.CodeAnalysis;

namespace Ml.Cli.WebApp.Server.Groups.Oidc;

[ExcludeFromCodeCoverage]
public class OidcUserInfo
{
    public string Email { get; set; }
}