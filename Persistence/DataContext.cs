using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Persistence.Daos;

namespace Persistence;

public class DataContext : IdentityDbContext<AppUserDao>
{
    public DbSet<ActivityDao> Activities { get; set; }
    public DbSet<ActivityAttendeeDao> ActivityAttendees { get; set; }
    public DbSet<PhotoDao> Photos { get; set; }
    public DbSet<CommentDao> Comments { get; set; }
    public DbSet<UserFollowingDao> UserFollowings { get; set; }

    public DataContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        ConfigActivity(builder);
        ConfigAppUser(builder);
        ConfigActivityAttendee(builder);
        ConfigPhoto(builder);
        ConfigUserFollowing(builder);
    }

    private void ConfigActivity(ModelBuilder builder)
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

    private void ConfigAppUser(ModelBuilder builder)
    {
        builder.Entity<AppUserDao>(options =>
        {
            options.Property(t => t.DisplayName)
                .HasMaxLength(100);
            options.Property(t => t.Bio);
        });
    }

    private void ConfigActivityAttendee(ModelBuilder builder)
    {
        builder.Entity<ActivityAttendeeDao>(options =>
        {
            options.Property(t => t.UserId)
                .IsRequired();
            options.HasKey(t => new { t.ActivityId, t.UserId });
            options.HasOne(t => t.Activity)
                .WithMany(t => t.Attendees)
                .HasForeignKey(t => t.ActivityId);
            options.HasOne(t => t.User)
                .WithMany(t => t.Activities)
                .HasForeignKey(t => t.UserId);
        });
    }

    private void ConfigPhoto(ModelBuilder builder)
    {
        builder.Entity<PhotoDao>(options =>
        {
            options.Property(t => t.Id)
                .IsRequired()
                .HasMaxLength(40);
            options.Property(t => t.Url)
                .IsRequired()
                .HasMaxLength(2000);
            options.HasOne(t => t.User)
                .WithMany(t => t.Photos)
                .HasForeignKey(t => t.UserId);
        });
    }

    private void ConfigComment(ModelBuilder builder)
    {
        builder.Entity<CommentDao>(options =>
        {
            options.Property(t => t.Body)
                .IsRequired()
                .HasMaxLength(10000);
            options.Property(t => t.AuthorId)
                .IsRequired();
            options.HasOne(t => t.Author)
                .WithMany(t => t.Comments)
                .HasForeignKey(t => t.AuthorId);
            options.HasOne(t => t.Activity)
                .WithMany(t => t.Comments)
                .HasForeignKey(t => t.ActivityId);
        });
    }

    private void ConfigUserFollowing(ModelBuilder builder)
    {
        builder.Entity<UserFollowingDao>(options =>
        {
            options.HasKey(t => new { t.ObserverId, t.TargetId });
            options.Property(t => t.ObserverId)
                .IsRequired();
            options.Property(t => t.TargetId)
                .IsRequired();
            options.HasOne(t => t.Observer)
                .WithMany(t => t.Followings)
                .HasForeignKey(t => t.ObserverId);
            options.HasOne(t => t.Target)
                .WithMany(t => t.Followers)
                .HasForeignKey(t => t.TargetId)
                .OnDelete(DeleteBehavior.NoAction);
        });
    }
}
