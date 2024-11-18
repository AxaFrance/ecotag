using System;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Server.Groups.Cmd;
using AxaGuilDEv.Ecotag.Server.Oidc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace AxaGuilDEv.Ecotag.Server.Groups;

[ExcludeFromCodeCoverage]
public static class UserMiddlewareExtensions
{
    public static IApplicationBuilder UseCreateUser(
        this IApplicationBuilder app)
    {
        if (app == null)
            throw new ArgumentNullException(nameof(app));
        return app.UseMiddleware<CreateUserMiddleware>();
    }
}

public class CreateUserMiddleware(RequestDelegate next)
{
    public const string Authorization = "Authorization";

    public async Task InvokeAsync(HttpContext context, CreateUserCmd createUserCmd)
    {
        if (!context.Request.Path.ToString().StartsWith("/api"))
        {
            await next.Invoke(context);
            return;
        }

        var nameIdentifier = context.User.Identity.GetNameIdentifier();
        var authorisation = context.Request.Headers[Authorization].ToString();
        var accessToken = string.IsNullOrEmpty(authorisation) ? string.Empty : authorisation.Replace("Bearer ", "");

        if (string.IsNullOrEmpty(accessToken)) await HttpCode(context, 401);

        if (!string.IsNullOrEmpty(nameIdentifier))
        {
            await createUserCmd.ExecuteAsync(new CreateUserInput
                { NameIdentifier = nameIdentifier, AccessToken = accessToken });
            await next.Invoke(context);
            return;
        }

        await HttpCode(context);
    }

    private static async Task HttpCode(HttpContext context, int httpCode = 403, string keyValue = "")
    {
        var response = context.Response;
        response.StatusCode = httpCode;
        var jsonString = JsonConvert.SerializeObject(new UnAuthorized
        {
            Key = keyValue
        });
        await response.WriteAsync(jsonString, Encoding.UTF8);
    }

    public class UnAuthorized
    {
        [JsonProperty("key")] public string Key { get; set; }
    }
}