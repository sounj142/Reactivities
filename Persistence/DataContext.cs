using Microsoft.EntityFrameworkCore;
using Persistence.Daos;

namespace Persistence;

public class DataContext : DbContext
{
    public DbSet<ActivityDao> Activities { get; set; }
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        ActivityConfig(builder);
    }

    private void ActivityConfig(ModelBuilder builder)
    {
        builder.Entity<ActivityDao>(options =>
        {
            options.Property(t => t.Title)
                .HasMaxLength(200)
                .IsRequired();

            options.Property(t => t.Description)
                .HasMaxLength(1000);

            options.Property(t => t.Category)
                .HasMaxLength(200);

            options.Property(t => t.City)
                .HasMaxLength(200);

            options.Property(t => t.Venue)
                .HasMaxLength(200);
        });
    }
}
