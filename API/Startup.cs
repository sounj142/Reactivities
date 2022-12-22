using Persistence;
using Application;
using API.Utils;
using ImageServices;
using API.SignalR;
using EmailServices;

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
            services.AddRepositoryServices(_configuration, "DefaultConnection");
            services.AddApplicationServices();
            services.AddApiServices(_configuration);
            services.AddImageServices(_configuration);
            services.AddEmailServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCustomExceptionHandler();

            ConfigureResponseHeaders(app);

            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseCors("CorsPolicy");
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat")
                    .RequireAuthorization();
                endpoints.MapFallbackToFile("index.html");
            });
        }

        private void ConfigureResponseHeaders(IApplicationBuilder app)
        {
            app.UseXContentTypeOptions();
            app.UseReferrerPolicy(options => options.NoReferrer());
            app.UseXXssProtection(options => options.EnabledWithBlockMode());
            app.UseXfo(options => options.Deny());
            app.UseCsp(options =>
                options.BlockAllMixedContent()
                .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com")
                    .UnsafeInline())
                .FontSources(s => s.Self().CustomSources(
                    "https://fonts.gstatic.com",
                    "data:"))
                .FormActions(s => s.Self())
                .FrameAncestors(s => s.Self())
                .ImageSources(s => s.Self().CustomSources(
                    "https://res.cloudinary.com",
                    "blob:",
                    "https://www.facebook.com",
                    "data:",
                    "*.fbcdn.net",
                    "https://platform-lookaside.fbsbx.com"))
                .ScriptSources(s => s.Self().CustomSources(
                    "https://connect.facebook.net",
                    "sha256-ZovcjcmxCp8sprlt10Itc5fgbC0ndFdKObAvwjHmNpk="))
            );
            app.UseHsts();
        }
    }
}
