using System;
using System.Net;
using System.Net.Http;
using Axa.Advalorem;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Ml.Cli.WebApp.Authorization;

namespace Ml.Cli.WebApp.Server
{
    public class StartupServer
    {
        public StartupServer(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            CurrentEnvironment = env;
        }

        private IWebHostEnvironment CurrentEnvironment { get; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            services.AddOptions();
            services.AddApplicationInsightsTelemetry(Configuration);
            services.AddResponseCaching();
            services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(365);
            });
            
             services.AddAuthorization(options =>
                  {
                      var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
                          JwtBearerDefaults.AuthenticationScheme);
                      defaultAuthorizationPolicyBuilder =
                          defaultAuthorizationPolicyBuilder
                              .RequireAuthenticatedUser();
                      options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();
                  });
              
            services.AddSingleton<IDateTime, SystemDateTime>();
            services
                .AddControllersWithViews();
            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
                options =>
                {
                    var oidcSettings = Configuration.GetSection("Oidc").Get<OidcSettings>();
                    options.Audience = AuthorizationAudience.ApiEcotag;
                    var proxyUrl = oidcSettings.ProxyUrl;
                    if (!string.IsNullOrEmpty(proxyUrl))
                    {
                        var handler = new HttpClientHandler
                        {
                            Proxy = new WebProxy(proxyUrl)
                            {
                                Credentials = CredentialCache.DefaultCredentials
                            }
                        };
                        options.BackchannelHttpHandler = handler;
                    }

                    options.Authority = oidcSettings.Authority;
                    options.RequireHttpsMetadata = oidcSettings.RequireHttpsMetadata;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        RequireSignedTokens = true
                    };
                });

            /*  var corsSettings = CorsSettings();
              if (!string.IsNullOrEmpty(corsSettings.Origins))
                  services.AddCors(options =>
                  {
                      options.AddPolicy("CorsPolicy",
                          builder =>
                          {
                              builder.WithOrigins(corsSettings.Origins.Split(";"))
                                  .AllowAnyMethod()
                                  .AllowAnyHeader()
                                  .AllowCredentials()
                                  .SetPreflightMaxAge(TimeSpan.FromSeconds(2520));
                          });
                  });*/

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build-server"; });

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo {Title = "AXA Fastag", Version = "v1"});
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseErrorLogging();
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("X-Xss-Protection", "1; mode=block");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                await next();
            });
            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseAuthentication();
           
            app.UseSwagger();
            app.UseSwaggerUI(options => { options.SwaggerEndpoint("/swagger/v1/swagger.json", "Ecotag"); });
            app.UseRouting();
            app.UseResponseCaching();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/isalive", async (HttpContext context) =>
                {
                    context.Response.StatusCode = 200;
                    await context.Response.WriteAsync("ok");
                });
                endpoints.MapControllers().RequireAuthorization();
                endpoints.MapControllerRoute(
                    "default", "{controller=Home}/{action=Index}/{id?}").RequireAuthorization();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start:server");
                }
            });
        }
    }
}