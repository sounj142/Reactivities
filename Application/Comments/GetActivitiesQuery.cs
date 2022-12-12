using MediatR;
using Domain.Repositories;
using Domain.Comments;

namespace Application.Comments;

public class GetCommentsQuery : IRequest<IList<CommentWithAuthor>>
{
    public Guid ActivityId { get; set; }
}

public class GetCommentsHandler : IRequestHandler<GetCommentsQuery, IList<CommentWithAuthor>>
{
    private readonly ICommentRepository _commentRepository;

    public GetCommentsHandler(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<IList<CommentWithAuthor>> Handle(GetCommentsQuery request, CancellationToken cancellationToken)
    {
        var comments = await _commentRepository.Get(request.ActivityId);
        return comments;
    }
}