using Domain.Comments;

namespace Domain.Repositories;

public interface ICommentRepository
{
    Task<IList<CommentWithAuthor>> Get(Guid activityId);
    Task<CommentWithAuthor> GetById(Guid id);
    Task Create(Comment comment);
}