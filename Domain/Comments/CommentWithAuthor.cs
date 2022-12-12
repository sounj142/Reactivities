namespace Domain.Comments;

public class CommentWithAuthor : Comment
{
    public string AuthorUserName { get; set; }
    public string AuthorDisplayName { get; set; }
    public string AuthorImage { get; set; }
}