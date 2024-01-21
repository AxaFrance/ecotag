using System;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Oidc;
using AxaGuilDEv.Ecotag.Server.Oidc;
using Microsoft.Extensions.Options;
using Moq;
using Moq.Protected;
using Xunit;

namespace AxaGuilDEv.Ecotag.Tests.Server.Groups.Oidc;

public class OidcUserInfoServiceSould
{
    [Fact]
    public async Task RetrunOidcUserInfo()
    {
        var httpMessageHandler = new Mock<HttpMessageHandler>();
        var httpsDemoIdentityserverIoApiUserInfo = "https://demo.identityserver.io/api/user_info";

        var resultConfiguration = new OidcConfiguration(httpsDemoIdentityserverIoApiUserInfo);
        var responseConfiguration = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(resultConfiguration, OidcConfigurationSerializerContext.Default.OidcConfiguration))
        };
        httpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>("SendAsync",
                ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Get
                                                     && req.RequestUri ==
                                                     new Uri(
                                                         "https://demo.identityserver.io/.well-known/openid-configuration")),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(responseConfiguration);

        var resultObject = new OidcUserInfo( "toto@gmail.fr");
        var serializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(resultObject, serializeOptions))
        };
        httpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>("SendAsync",
                ItExpr.Is<HttpRequestMessage>(req => req.Method == HttpMethod.Get
                                                     && req.RequestUri ==
                                                     new Uri(httpsDemoIdentityserverIoApiUserInfo)),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(response);


        var httpClient = new HttpClient(httpMessageHandler.Object);
        var mockFactory = new Mock<IHttpClientFactory>();
        mockFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

        var someOptions = Options.Create(new OidcSettings { Authority = "https://demo.identityserver.io" });

        var service = new OidcUserInfoService(mockFactory.Object, someOptions);
        var result = await service.GetUserEmailAsync("access_token");

        Assert.Equal(resultObject.Email, result.Email);
    }
}