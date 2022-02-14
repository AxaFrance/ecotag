using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Ml.Cli.WebApp.Server.Database.Users;

public static class ConfigureExtension
{
    public static void ConfigureUserRattachment(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<UserContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("UserContext")));
        services.AddScoped<UserContext, UserContext>();
        services.AddScoped<IUsersRepository, UsersRepository>();
    }
}