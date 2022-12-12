namespace Persistence.Daos;

public class ActivityDao
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTimeOffset Date { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }
    public bool IsCancelled { get; set; }

    public IList<ActivityAttendeeDao> Attendees { get; set; }
    public IList<CommentDao> Comments { get; set; }
}