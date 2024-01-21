using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Oidc;
using Microsoft.Extensions.Options;

namespace AxaGuilDEv.Ecotag.Server.Groups.Oidc;

public interface IOidcUserInfoService
{
    public Task<OidcUserInfo> GetUserEmailAsync(string accessToken);
}

public class OidcUserInfoService : IOidcUserInfoService
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly OidcSettings _oidcSettings;

    public OidcUserInfoService(IHttpClientFactory clientFactory, IOptions<OidcSettings> oidcSettings)
    {
        _clientFactory = clientFactory;
        _oidcSettings = oidcSettings.Value;
    }

    public async Task<OidcUserInfo> GetUserEmailAsync(string accessToken)
    {
        var oidcConfiguration = await GetOidcConfigurationAsync();
        var request = new HttpRequestMessage(HttpMethod.Get,
            oidcConfiguration.userinfo_endpoint);
        request.Headers.Add("authorization", $"Bearer {accessToken}");
        var client = _clientFactory.CreateClient(NamedHttpClients.ProxiedClient);
        var response = await client.SendAsync(request);
        await using var responseStream = await response.Content.ReadAsStreamAsync();
        var userInfo = await JsonSerializer.DeserializeAsync(responseStream, OidcUserInfoSerializerContext.Default.OidcUserInfo);
        return userInfo;
    }

    private async Task<OidcConfiguration> GetOidcConfigurationAsync()
    {
        var request = new HttpRequestMessage(HttpMethod.Get,
            $"{_oidcSettings.Authority}/.well-known/openid-configuration");
        var client = _clientFactory.CreateClient(NamedHttpClients.ProxiedClient);
        var response = await client.SendAsync(request);
        await using var responseStream = await response.Content.ReadAsStreamAsync();
        var userInfo = await JsonSerializer.DeserializeAsync(responseStream, OidcConfigurationSerializerContext.Default.OidcConfiguration);
        return userInfo;
    }
}