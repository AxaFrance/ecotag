using System.Threading.Tasks;
using AxaGuilDEv.MlCli.Extentions.OAuth2ClientCredentials;
using IdentityModel.Client;

namespace AxaGuilDEv.MlCli.Extentions.Http.OAuth2ClientCredentials;

public interface IOAuth2ClientCredentialsClient
{
    Task<TokenResponse> GetAccessTokenWithClientAssertionAsync(OAuth2ClientCredentialsOptions options);
}