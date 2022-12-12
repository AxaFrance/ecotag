using System.Threading.Tasks;
using IdentityModel.Client;
using Ml.Cli.Extensions.OAuth2ClientCredentials;

namespace Ml.Cli.Extensions.Http.OAuth2ClientCredentials;

public interface IOAuth2ClientCredentialsClient
{
    Task<TokenResponse> GetAccessTokenWithClientAssertionAsync(OAuth2ClientCredentialsOptions options);
}