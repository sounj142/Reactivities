using Microsoft.OpenApi.Models;
using Persistence;
using Application;
using FluentValidation;
using API.Utils;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _configuration;
        public Startup(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddControllers(options =>
                    options.Filters.Add<ModelStateValidationActionFilterAttribute>());
            services.Configure<ApiBehaviorOptions>(options =>
                {
                    // disable default Validation failure response mechanism
                    options.SuppressModelStateInvalidFilter = true;
                });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });

            services.AddRepositoryServices(_configuration, "DefaultConnection");
            services.AddApplicationServices();

            services
                .AddFluentValidationAutoValidation()
                .AddValidatorsFromAssemblyContaining<Application.Activities.Dtos.ActivityDto>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCustomExceptionHandler();

            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebAPIv5 v1"));
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
