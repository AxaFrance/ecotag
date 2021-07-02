namespace Ml.Cli.Extensions.OAuth2ClientCredentials
{
    using System;
    using System.Collections.Generic;
    using System.IdentityModel.Tokens.Jwt;
    using System.Net.Http;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;

    using IdentityModel;
    using IdentityModel.Client;
    using Microsoft.IdentityModel.Tokens;

    public static class HttpClientExtensions
    {
        private const long UnixEpochTicks = 621_355_968_000_000_000;

        public static async Task<TokenResponse> GetAccessTokenWithClientAssertionAsync(this HttpClient httpClient, OAuth2ClientCredentialsBaseOptions options)
        {
            // discover endpoints from metadata
            var discoverClient = await httpClient.GetDiscoveryDocumentAsync(options.Authority).ConfigureAwait(false);
            if (discoverClient.IsError)
            {
                return null;
            }

            // prepare the request for a Client Credentials Access_Token with client_assertion jwt bearer signature
            var clientToken = GenerateJwtToken(discoverClient.TokenEndpoint, options);
            var tokenResponse = await httpClient.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
            {
                Address = discoverClient.TokenEndpoint,
                ClientId = options.ClientId,
                Scope = options.Scope,
                ClientAssertion = {Type = OidcConstants.ClientAssertionTypes.JwtBearer, Value = clientToken}
            }).ConfigureAwait(false);

            return tokenResponse;
        }

        private static string GenerateJwtToken(string audience, OAuth2ClientCredentialsBaseOptions options)
        {
            var epochUtcNow = (DateTime.UtcNow.Ticks - UnixEpochTicks) / 10_000_000;
            const int expInSeconds = 10 * 60;
            var exp = (expInSeconds + epochUtcNow).ToString();

            var claims = new List<Claim>
                         {
                             new Claim(JwtClaimTypes.JwtId, Guid.NewGuid().ToString()),
                             new Claim(JwtClaimTypes.Issuer, options.ClientId),
                             new Claim(JwtClaimTypes.Subject, options.ClientId),
                             new Claim(JwtClaimTypes.Audience, audience),
                             new Claim(JwtClaimTypes.Expiration, exp, ClaimValueTypes.Integer64),
                         };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.ClientSecret));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            
            var header = new JwtHeader(signingCredentials);
            var payload = new JwtPayload(claims);
            var token = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
