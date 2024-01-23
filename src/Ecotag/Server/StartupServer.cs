using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using AxaGuilDEv.Ecotag.Local;
using AxaGuilDEv.Ecotag.Server.Audits;
using AxaGuilDEv.Ecotag.Server.Audits.Database;
using AxaGuilDEv.Ecotag.Server.Datasets;
using AxaGuilDEv.Ecotag.Server.Datasets.Database;
using AxaGuilDEv.Ecotag.Server.Groups;
using AxaGuilDEv.Ecotag.Server.Groups.Database;
using AxaGuilDEv.Ecotag.Server.Groups.Oidc;
using AxaGuilDEv.Ecotag.Server.Oidc;
using AxaGuilDEv.Ecotag.Server.Projects;
using AxaGuilDEv.Ecotag.Server.Projects.Database;
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
using AnnotationsController = AxaGuilDEv.Ecotag.Local.AnnotationsController;
using DatasetsController = AxaGuilDEv.Ecotag.Local.DatasetsController;

namespace AxaGuilDEv.Ecotag.Server;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection Remove<T>(this IServiceCollection services)
    {
        if (services.IsReadOnly) throw new ReadOnlyException($"{nameof(services)} is read only");

        var serviceDescriptor = services.FirstOrDefault(descriptor => descriptor.ServiceType == typeof(T));
        if (serviceDescriptor != null) services.Remove(serviceDescriptor);

        return services;
    }
}

[ExcludeFromCodeCoverage]
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
        services.Configure<OidcSettings>(
            Configuration.GetSection(OidcSettings.Oidc));
        services.Configure<DatasetsSettings>(
            Configuration.GetSection(DatasetsSettings.Datasets));
        services.Configure<DatabaseSettings>(
            Configuration.GetSection(DatabaseSettings.Database));
        var oidcSettings = Configuration.GetSection(OidcSettings.Oidc).Get<OidcSettings>();
        var oidcUserSettings = Configuration.GetSection(OidcUserSettings.OidcUser).Get<OidcUserSettings>();
        var httpClientService = services.AddHttpClient(NamedHttpClients.ProxiedClient);
        services.AddMemoryCache();
        if (!string.IsNullOrEmpty(oidcSettings.ProxyUrl))
            httpClientService.ConfigurePrimaryHttpMessageHandler(() =>
                new SocketsHttpHandler
                {
                    UseProxy = true,
                    Proxy = new WebProxy(oidcSettings.ProxyUrl)
                    {
                        Credentials = CredentialCache.DefaultCredentials
                    }
                });

        services.AddScoped<OidcUserInfoService>();
        services.AddOptions();
        services.AddApplicationInsightsTelemetry(Configuration);
        services.AddResponseCaching();
        services.AddHsts(options =>
        {
            options.Preload = true;
            options.IncludeSubDomains = true;
            options.MaxAge = TimeSpan.FromDays(365);
        });

        services.ConfigureGroups(Configuration);
        services.ConfigureDatasets(Configuration);
        services.ConfigureProjects(Configuration);
        services.ConfigureServiceAudits(Configuration);

        services.AddAuthorization(options =>
        {
            var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
                JwtBearerDefaults.AuthenticationScheme);
            defaultAuthorizationPolicyBuilder =
                defaultAuthorizationPolicyBuilder
                    .RequireAuthenticatedUser();
            if (oidcUserSettings.RequireScopes != null)
            {
                var requireScopes = oidcUserSettings.RequireScopes.ToArray();
                if (requireScopes.Length > 0)
                    defaultAuthorizationPolicyBuilder.RequireScope(oidcUserSettings.RequireScopes.ToArray());
            }

            options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();
        });

        services.AddSingleton<IDateTime, SystemDateTime>();
        services
            .AddControllersWithViews();

        services.Remove<AnnotationsController>();
        services.Remove<ComparesController>();
        services.Remove<DatasetsController>();
        services.Remove<FilesController>();
        services.Remove<GalleryController>();

        var oidcMode = Configuration["OidcMode"];

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(
            options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        if (oidcMode == "AXA_FRANCE")
                        {
                            var profiles = context.Principal.Identity.GetProfiles();
                            var claims = profiles.Select(profile => new Claim(ClaimTypes.Role, profile));
                            ((ClaimsIdentity)context.Principal.Identity).AddClaims(claims);
                            return Task.CompletedTask;
                        }
                        else
                        {
                            //var usersRepository =
                            //    context.HttpContext.RequestServices.GetRequiredService<UsersRepository>();
                            //var nameIdentifier = context.Principal.Identity.GetNameIdentifier();
                            //var userTask = usersRepository.GetUserByNameIdentifierAsync(nameIdentifier);
                            //userTask.Wait();
                            var role = ""; //userTask.Result.Role;
                            var roles = new List<string>();
                            if (role == Roles.DataScientist)
                            {
                                roles.Add(Roles.DataAnnoteur);
                                roles.Add(Roles.DataScientist);
                            }
                            else if (role == Roles.DataAdministateur)
                            {
                                roles.Add(Roles.DataScientist);
                                roles.Add(Roles.DataAnnoteur);
                                roles.Add(Roles.DataAdministateur);
                            }

                            roles.Add(Roles.DataScientist);
                            roles.Add(Roles.DataAnnoteur);
                            roles.Add(Roles.DataAdministateur);

                            var claims = roles.Select(profile => new Claim(ClaimTypes.Role, profile));
                            ((ClaimsIdentity)context.Principal.Identity).AddClaims(claims);

                            // If your authentication logic is based on users then add your logic here
                            return Task.CompletedTask;
                        }
                    }
                };
                var isValidateAudience = !string.IsNullOrEmpty(oidcUserSettings.RequireAudience);
                if (isValidateAudience) options.Audience = oidcUserSettings.RequireAudience;

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
                    ValidateAudience = isValidateAudience,
                    ValidateLifetime = true,
                    RequireSignedTokens = true
                };
            });

        services.Configure<CorsSettings>(
            Configuration.GetSection(CorsSettings.Cors));
        var corsSettings = GetCorsSettings();
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
            });

        // In production, the React files will be served from this directory
        if (IsSpaStaticFiles())
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build-server"; });
        if (IsSwagger())
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "Ecotag", Version = "v1" });
            });
    }

    private bool IsSwagger()
    {
        return Configuration["SwaggerActive"] == "True";
    }

    private CorsSettings GetCorsSettings()
    {
        var corsSettings = Configuration.GetSection(CorsSettings.Cors).Get<CorsSettings>();
        return corsSettings;
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
    {
        app.UseErrorLogging();
        AuditsService.ConfigureAudits(serviceProvider);
        
        var databaseSettings = Configuration.GetSection(DatabaseSettings.Database).Get<DatabaseSettings>();
        if (databaseSettings.Mode == DatabaseMode.Sqlite)
        {
            var file = new DirectoryInfo("./.db");
            if (!file.Exists) file.Create();
            var auditContext = serviceProvider.GetService<AuditContext>();
            auditContext.Database.EnsureCreated();
            var datasetContext = serviceProvider.GetService<DatasetContext>();
            datasetContext.Database.EnsureCreated();
            var projectContext = serviceProvider.GetService<ProjectContext>();
            projectContext.Database.EnsureCreated();
            var groupContext = serviceProvider.GetService<GroupContext>();
            groupContext.Database.EnsureCreated();
        }

        app.Use(async (context, next) =>
        {
            context.Response.Headers.Append("X-Frame-Options", "sameorigin");
            context.Response.Headers.Append("X-Xss-Protection", "1; mode=block");
            context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
            await next();
        });
        if (!env.IsDevelopment())
        {
            app.UseHttpsRedirection();
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        var isSpaStaticFiles = IsSpaStaticFiles();
        if (isSpaStaticFiles)
        {
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
        }

        var corsSettings = GetCorsSettings();
        if (!string.IsNullOrEmpty(corsSettings.Origins)) app.UseCors("CorsPolicy");

        app.UseAuthentication();
        if (IsSwagger())
        {
            app.UseSwagger();
            app.UseSwaggerUI(options => { options.SwaggerEndpoint("/swagger/v1/swagger.json", "Ecotag"); });
        }

        app.UseRouting();
        app.UseResponseCaching();
        app.UseAuthorization();
        app.UseCreateUser();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapGet("/isalive", async context =>
            {
                context.Response.StatusCode = 200;
                await context.Response.WriteAsync("ok");
            });
            endpoints.MapControllers().RequireAuthorization();
            endpoints.MapControllerRoute(
                "default", "{controller=Home}/{action=Index}/{id?}").RequireAuthorization();
        });

        if (isSpaStaticFiles)
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment()) spa.UseReactDevelopmentServer("start:server");
            });
    }

    private bool IsSpaStaticFiles()
    {
        var isSpaStaticFiles = Configuration.GetSection("SpaStaticFiles").Get<bool>();
        return isSpaStaticFiles;
    }
}