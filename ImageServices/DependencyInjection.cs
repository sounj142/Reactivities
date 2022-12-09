using Domain.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ImageServices;

public static class DependencyInjection
{
    public static IServiceCollection AddImageServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton<CloudinarySettings>((serviceProvider) =>
        {
            var settings = configuration.GetSection("Cloudinary").Get<CloudinarySettings>();
            return settings;
        });
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();

        return services;
    }
}