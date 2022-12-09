using AutoMapper;
using Domain.Exceptions;
using Domain.Photos;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Persistence.Daos;

namespace Persistence.Repositories;

public class ProfileRepository : IProfileRepository
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public ProfileRepository(DataContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<UserProfile> GetUserProfile(string userId)
    {
        var user = await _dbContext.Users.Include(x => x.Photos)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId);
        return _mapper.Map<UserProfile>(user);
    }

    public async Task<Photo> CreatePhoto(string id, string url, string userId, bool isMain)
    {
        var photo = new PhotoDao
        {
            Id = id,
            Url = url,
            UserId = userId,
            IsMain = isMain
        };
        _dbContext.Photos.Add(photo);
        await _dbContext.SaveChangesAsync();
        return _mapper.Map<Photo>(photo);
    }

    public async Task DeletePhoto(string id)
    {
        var photo = await _dbContext.Photos
            .FirstOrDefaultAsync(x => x.Id == id);
        if (photo == null)
            throw new NotFoundException(ErrorCode.REPO0006, "Deletion rejected. Photo is not found.");

        _dbContext.Photos.Remove(photo);
        await _dbContext.SaveChangesAsync();
    }
}