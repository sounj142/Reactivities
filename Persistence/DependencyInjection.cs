using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence.Repositories;

namespace Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddRepositoryServices(
        this IServiceCollection services,
        IConfiguration configuration,
        string connectionStringName)
    {
        services.AddDbContext<DataContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString(connectionStringName),
                b => b.MigrationsAssembly(typeof(DataContext).Assembly.FullName))
            );

        services.AddScoped<IActivityRepository, ActivityRepository>();
        services.AddScoped<IProfileRepository, ProfileRepository>();

        return services;
    }
}
