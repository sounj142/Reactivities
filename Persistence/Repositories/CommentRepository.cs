using Domain.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Persistence.Daos;
using Domain.Comments;

namespace Persistence.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public CommentRepository(DataContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<IList<CommentWithAuthor>> Get(Guid activityId)
    {
        var comments = await _dbContext.Comments.AsNoTracking()
            .ProjectTo<CommentWithAuthor>(_mapper.ConfigurationProvider)
            .Where(x => x.ActivityId == activityId)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync();
        return comments;
    }

    public async Task<CommentWithAuthor> GetById(Guid id)
    {
        return await _dbContext.Comments.AsNoTracking()
            .ProjectTo<CommentWithAuthor>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task Create(Comment comment)
    {
        var commentDao = _mapper.Map<CommentDao>(comment);

        _dbContext.Comments.Add(commentDao);
        await _dbContext.SaveChangesAsync();
    }
}