using System.Text;
using API.Identity;
using API.Utils;
using Domain.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Persistence.Daos;

namespace API;

public static class DependencyInjection
{
    public static IServiceCollection AddApiServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddControllers(options =>
            {
                var authenticatePolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                options.Filters.Add(new AuthorizeFilter(authenticatePolicy));
                options.Filters.Add<ModelStateValidationActionFilterAttribute>();
            });

        services.Configure<ApiBehaviorOptions>(options =>
            {
                // disable default Validation failure response mechanism
                options.SuppressModelStateInvalidFilter = true;
            });

        var clientHost = configuration["ClientHost"];
        if (!string.IsNullOrEmpty(clientHost))
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .WithOrigins(clientHost);
                });
            });
        }

        services
                .AddFluentValidationAutoValidation()
                .AddValidatorsFromAssemblyContaining<Application.Activities.Dtos.ActivityDto>()
                .AddValidatorsFromAssemblyContaining<Startup>();

        services.AddScoped<TokenService>();
        services.AddScoped<ICurrentUserContext, CurrentUserContext>();

        services.AddSignalR();

        services.AddHttpClient();

        ConfigIdentity(services, configuration);

        return services;
    }

    private static void ConfigIdentity(
        IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddIdentityCore<AppUserDao>(options =>
            {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;

                options.SignIn.RequireConfirmedEmail = true;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddDefaultTokenProviders()
            .AddSignInManager<SignInManager<AppUserDao>>();

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = (context) =>
                    {
                        var accessToken = context.Request.Query["access_token"].FirstOrDefault();
                        var path = context.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/chat"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });
    }
}
