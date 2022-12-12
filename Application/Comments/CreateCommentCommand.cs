using Application.Comments.Dtos;
using AutoMapper;
using Domain.Comments;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Comments;

public class CreateCommentCommand : IRequest<CommentWithAuthor>
{
    public CommentDto Comment { get; set; }
}

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, CommentWithAuthor>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IMapper _mapper;
    private readonly ICurrentUserContext _currentUserContext;

    public CreateCommentCommandHandler(
        ICommentRepository commentRepository,
        IMapper mapper,
        ICurrentUserContext currentUserContext)
    {
        _commentRepository = commentRepository;
        _mapper = mapper;
        _currentUserContext = currentUserContext;
    }

    public async Task<CommentWithAuthor> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = _mapper.Map<Comment>(request.Comment);
        comment.Id = Guid.NewGuid();
        comment.AuthorId = _currentUserContext.GetCurrentUserId();
        comment.CreatedAt = _currentUserContext.GetClientNow();

        await _commentRepository.Create(comment);

        var createdComment = await _commentRepository.GetById(comment.Id);
        return createdComment;
    }
}