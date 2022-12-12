using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace AxaGuilDEv.Ecotag.Server;

public class ErrorLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public ErrorLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, ILogger<ErrorLoggingMiddleware> logger,
        IWebHostEnvironment environment)
    {
        try
        {
            await _next(context);
        }
        catch (Exception e)
        {
            logger.LogError(e, $"The following error happened: {e.Message}");
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";
                if (environment.IsDevelopment())
                    await SendJsonResponseAsync(context, e);
                else
                    await SendJsonResponseAsync(context, new WrappedError { RequestId = context.TraceIdentifier });
            }
        }
    }

    private static async Task SendJsonResponseAsync<T>(HttpContext context, T error)
    {
        var json = JsonConvert.SerializeObject(error, new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        });
        await context.Response.WriteAsync(json);
    }
}

public class WrappedError
{
    public string RequestId { get; set; }
}

public static class ErrorLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseErrorLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ErrorLoggingMiddleware>();
    }
}