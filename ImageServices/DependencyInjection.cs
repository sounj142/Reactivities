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
            configuration.GetSection("Cloudinary").Get<CloudinarySettings>());
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();

        return services;
    }
}