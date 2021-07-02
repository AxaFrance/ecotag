using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;

namespace Ml.Cli.Extensions.Http.OAuth2ClientCredentials
{
    using Extensions.OAuth2ClientCredentials;

    public class OAuth2ClientCredentialsClient : IOAuth2ClientCredentialsClient
    {
        private readonly HttpClient httpClient;

        public OAuth2ClientCredentialsClient(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public async Task<TokenResponse> GetAccessTokenWithClientAssertionAsync(OAuth2ClientCredentialsOptions options)
        {
            return await this.httpClient.GetAccessTokenWithClientAssertionAsync(options);
        }
    }
}
