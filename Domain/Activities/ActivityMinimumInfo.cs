namespace Domain.Activities;

public class ActivityMinimumInfo
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTimeOffset Date { get; set; }
    public string Category { get; set; }
}