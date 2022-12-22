using Domain.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EmailServices;

public static class DependencyInjection
{
    public static IServiceCollection AddEmailServices(this IServiceCollection services)
    {
        services.AddScoped<IEmailSender, EmailSender>();
        return services;
    }
}