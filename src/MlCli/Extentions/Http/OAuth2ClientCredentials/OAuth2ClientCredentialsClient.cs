using System.Net.Http;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.Extentions.OAuth2ClientCredentials;
using IdentityModel.Client;

namespace AxaGuilDEv.MlCli.Extentions.Http.OAuth2ClientCredentials;

public class OAuth2ClientCredentialsClient : IOAuth2ClientCredentialsClient
{
    private readonly HttpClient httpClient;

    public OAuth2ClientCredentialsClient(HttpClient httpClient)
    {
        this.httpClient = httpClient;
    }

    public async Task<TokenResponse> GetAccessTokenWithClientAssertionAsync(OAuth2ClientCredentialsOptions options)
    {
        return await httpClient.GetAccessTokenWithClientAssertionAsync(options);
    }
}