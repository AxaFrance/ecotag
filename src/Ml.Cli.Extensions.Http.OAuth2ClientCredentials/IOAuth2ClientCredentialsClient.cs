using System.Threading.Tasks;
using IdentityModel.Client;

namespace Ml.Cli.Extensions.Http.OAuth2ClientCredentials
{
    using Extensions.OAuth2ClientCredentials;

    public interface IOAuth2ClientCredentialsClient
    {
        Task<TokenResponse> GetAccessTokenWithClientAssertionAsync(OAuth2ClientCredentialsOptions options);
    }
}
