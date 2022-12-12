namespace Domain.Activities;

public class ActivityWithAttendees : Activity
{
    public bool IsCancelled { get; set; }
    public IList<Attendee> Attendees { get; set; }
}