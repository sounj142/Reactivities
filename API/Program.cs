using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            await InitializeDatabase(host);
            await host.RunAsync();
        }

        private static async Task InitializeDatabase(IHost host)
        {
            using var scope = host.Services.CreateScope();
            try
            {
                using var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                await context.Database.MigrateAsync();
                await SeedData.Seed(context);
            }
            catch (Exception ex)
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occured during migration database");
                throw;
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
