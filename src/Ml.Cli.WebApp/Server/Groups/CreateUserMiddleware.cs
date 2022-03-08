using System;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Ml.Cli.WebApp.Server.Groups.Cmd;
using Ml.Cli.WebApp.Server.Oidc;
using Newtonsoft.Json;

namespace Ml.Cli.WebApp.Server.Groups;

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

    public class CreateUserMiddleware
    {
        public const string Authorization = "Authorization";
        private readonly RequestDelegate _next;

        public CreateUserMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, CreateUserCmd createUserCmd)
        {
            if (!context.Request.Path.ToString().StartsWith("/api"))
            {
                await _next.Invoke(context);
                return;
            }
            
            var subject = context.User.Identity.GetSubject();
            var authorisation = context.Request.Headers[Authorization].ToString();
            var accessToken = String.IsNullOrEmpty(authorisation) ? String.Empty : authorisation.Replace("Bearer ", "");

            if (string.IsNullOrEmpty(accessToken))
            {
                await HttpCode(context, 401);
            }
            
            if (!string.IsNullOrEmpty(subject))
            {
                await createUserCmd.ExecuteAsync(new CreateUserInput() { Subject = subject, AccessToken = accessToken });
                await _next.Invoke(context);
                return;
            }
            await HttpCode(context);
        }

        private static async Task HttpCode(HttpContext context,int httpCode=403, string keyValue = "")
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
            [JsonProperty("key")]
            public string Key { get; set; }
        }
    }