namespace Application.Activities.Dtos;

public class ActivityDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public DateTimeOffset Date { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string City { get; set; }
    public string Venue { get; set; }
}