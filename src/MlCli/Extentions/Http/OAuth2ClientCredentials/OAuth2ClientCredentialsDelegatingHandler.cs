using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using AxaGuilDEv.MlCli.Extentions.OAuth2ClientCredentials;
using IdentityModel;
using Microsoft.Extensions.Caching.Memory;

namespace AxaGuilDEv.MlCli.Extentions.Http.OAuth2ClientCredentials;

public class OAuth2ClientCredentialsDelegatingHandler : DelegatingHandler
{
    private const int TokenCacheDurationSkewInSeconds = 5 * 60;
    private readonly IMemoryCache memoryCache;
    private readonly IOAuth2ClientCredentialsClient oAuth2ClientCredentialsClient;
    private readonly OAuth2ClientCredentialsOptions options;

    public OAuth2ClientCredentialsDelegatingHandler(IMemoryCache memoryCache, IOAuth2ClientCredentialsClient client,
        OAuth2ClientCredentialsOptions options)
    {
        this.memoryCache = memoryCache;
        oAuth2ClientCredentialsClient = client;
        this.options = options;
    }

    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        // try get the token from the memory cache
        if (!memoryCache.TryGetValue(options.CacheKey, out string accessToken))
        {
            // Key not in cache, so get data.                
            var tokenResponse = await oAuth2ClientCredentialsClient.GetAccessTokenWithClientAssertionAsync(options)
                .ConfigureAwait(false);

            if (tokenResponse != null && !tokenResponse.IsError)
            {
                // Define the expiration of the cache entry = token expiry - TokenCacheDurationSkewInSeconds.
                var expiration = tokenResponse.ExpiresIn - TokenCacheDurationSkewInSeconds;
                // Save in the cache only when expiration > 0 
                if (expiration > 0)
                {
                    // Set cache options.
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        // Keep in cache for this time
                        .SetAbsoluteExpiration(TimeSpan.FromSeconds(expiration));

                    // Save accessToken in cache.
                    memoryCache.Set(options.CacheKey, tokenResponse.AccessToken, cacheEntryOptions);
                }

                accessToken = tokenResponse.AccessToken;
            }
            else
            {
                return await Task.FromResult(new HttpResponseMessage(HttpStatusCode.Unauthorized))
                    .ConfigureAwait(false);
            }
        }

        const string bearer = OidcConstants.AuthenticationSchemes.AuthorizationHeaderBearer;
        request.Headers.Authorization = new AuthenticationHeaderValue(bearer, accessToken);
        return await base.SendAsync(request, cancellationToken);
    }
}