using System;
using System.Net;
using System.Net.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace Ml.Cli.Extensions.Http.OAuth2ClientCredentials
{
    using System.Linq;
    using Extensions.OAuth2ClientCredentials;

    public static class OAuth2ClientCredentialsHttpClientBuilderExtensions
    {
        public static IHttpClientBuilder AddOAuth2ClientCredentialsMessageHandler(this IHttpClientBuilder builder,
            OAuth2ClientCredentialsOptions options)
        {
            builder.Services.AddMemoryCache();
            if (builder.Services.All(x => x.ServiceType != typeof(IOAuth2ClientCredentialsClient)))
            {
                builder.Services.AddHttpClient<IOAuth2ClientCredentialsClient, OAuth2ClientCredentialsClient>(
                        httpClient =>
                        {
                            httpClient.BaseAddress = new Uri(options.Authority);
                        })
                    .ConfigurePrimaryHttpMessageHandler(() => GetProxyAwareHttpMessageHandler(options.ProxyAddress));
            }

            builder.AddHttpMessageHandler(serviceProvider =>
            {
                var httpClient = serviceProvider.GetService<IOAuth2ClientCredentialsClient>();
                return new OAuth2ClientCredentialsDelegatingHandler(serviceProvider.GetService<IMemoryCache>(), httpClient, options);
            });

            return builder;
        }

        private static HttpMessageHandler GetProxyAwareHttpMessageHandler(string proxyAddress)
        {
            var handler = new HttpClientHandler();

            if (!string.IsNullOrEmpty(proxyAddress))
            {
                handler.Proxy = new WebProxy(proxyAddress)
                {
                    Credentials = CredentialCache.DefaultCredentials
                };
            }

            return handler;
        }
    }
}
