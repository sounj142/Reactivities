namespace Domain;

public class ActivityWithAttendees : Activity
{
    public IList<Attendee> Attendees { get; set; }
}