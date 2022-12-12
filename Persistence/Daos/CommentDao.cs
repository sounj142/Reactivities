namespace Persistence.Daos;

public class CommentDao
{
    public Guid Id { get; set; }
    public string Body { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid ActivityId { get; set; }
    public string AuthorId { get; set; }

    public AppUserDao Author { get; set; }
    public ActivityDao Activity { get; set; }
}