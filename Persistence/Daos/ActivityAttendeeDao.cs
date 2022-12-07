namespace Persistence.Daos;

public class ActivityAttendeeDao
{
    public Guid ActivityId { get; set; }
    public string UserId { get; set; }
    public DateTimeOffset DateJoined { get; set; }
    public bool IsHost { get; set; }

    public ActivityDao Activity { get; set; }
    public AppUserDao User { get; set; }
}