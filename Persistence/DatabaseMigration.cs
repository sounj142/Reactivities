
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Persistence.Daos;

namespace Persistence
{
    public class DatabaseMigration
    {
        public static async Task InitializeDatabase(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            try
            {
                using var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                using var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUserDao>>();
                await context.Database.MigrateAsync();
                await SeedInitialUsers(userManager);
                await SeedInitialActivities(context);
            }
            catch (Exception ex)
            {
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<DatabaseMigration>>();
                logger.LogError(ex, "An error occured during migrate database");
                throw;
            }
        }

        private static async Task SeedInitialUsers(UserManager<AppUserDao> userManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var users = new List<AppUserDao> {
                new AppUserDao
                {
                    DisplayName = "Hoang Luong",
                    UserName="tazan645",
                    Email="tazan645@gmail.com",
                    Bio="male"
                },
                new AppUserDao
                {
                    DisplayName = "Tom",
                    UserName="tom",
                    Email="tom@hoang11xx.com",
                    Bio="male"
                },
                new AppUserDao
                {
                    DisplayName = "Jane",
                    UserName="jane",
                    Email="jane@hoang11xx.com",
                    Bio="female"
                }
            };

            const string password = "111111";
            foreach (var user in users)
            {
                await userManager.CreateAsync(user, password);
            }
        }

        private static async Task SeedInitialActivities(DataContext context)
        {
            if (await context.Activities.AnyAsync()) return;
            var users = await context.Users.ToListAsync();

            var activities = new List<ActivityDao>
            {
                new ActivityDao
                {
                    Title = "Past Activity 1",
                    Date = DateTime.Now.AddMonths(-2),
                    Description = "Activity 2 months ago",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[0],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Past Activity 2",
                    Date = DateTime.Now.AddMonths(-1),
                    Description = "Activity 1 month ago",
                    Category = "culture",
                    City = "Paris",
                    Venue = "Louvre",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[0],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 1",
                    Date = DateTime.Now.AddMonths(1),
                    Description = "Activity 1 month in future",
                    Category = "culture",
                    City = "London",
                    Venue = "Natural History Museum",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[0],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 2",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 2 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "O2 Arena",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[0],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 3",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 3 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Another pub",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[0],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 4",
                    Date = DateTime.Now.AddMonths(2),
                    Description = "Activity 4 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Yet another pub",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[1],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 5",
                    Date = DateTime.Now.AddMonths(5),
                    Description = "Activity 5 months in future",
                    Category = "drinks",
                    City = "London",
                    Venue = "Just another pub",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[1],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 6",
                    Date = DateTime.Now.AddMonths(6),
                    Description = "Activity 6 months in future",
                    Category = "music",
                    City = "London",
                    Venue = "Roundhouse Camden",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[1],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 7",
                    Date = DateTime.Now.AddMonths(7),
                    Description = "Activity 2 months ago",
                    Category = "travel",
                    City = "London",
                    Venue = "Somewhere on the Thames",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[1],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                },
                new ActivityDao
                {
                    Title = "Future Activity 8",
                    Date = DateTime.Now.AddMonths(8),
                    Description = "Activity 8 months in future",
                    Category = "film",
                    City = "London",
                    Venue = "Cinema",
                    Attendees = new List<ActivityAttendeeDao>
                    {
                        new ActivityAttendeeDao
                        {
                            User = users[1],
                            IsHost = true,
                            DateJoined = DateTime.Now
                        }
                    }
                }
            };

            await context.Activities.AddRangeAsync(activities);
            await context.SaveChangesAsync();
        }
    }
}