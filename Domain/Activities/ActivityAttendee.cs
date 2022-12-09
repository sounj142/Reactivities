namespace Domain.Activities;

public class ActivityAttendee
{
    public Guid ActivityId { get; set; }
    public string UserId { get; set; }
    public DateTimeOffset DateJoined { get; set; }
    public bool IsHost { get; set; }
}