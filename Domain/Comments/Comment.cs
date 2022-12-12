namespace Domain.Comments;

public class Comment
{
    public Guid Id { get; set; }
    public string Body { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid ActivityId { get; set; }
    public string AuthorId { get; set; }
}