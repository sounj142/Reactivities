using AutoMapper;
using AutoMapper.QueryableExtensions;
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
        var user = await _dbContext.Users.AsNoTracking()
            .ProjectTo<UserProfile>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == userId);
        return user;
    }

    public async Task<UserProfileFullInfo> GetUserProfileByUserName(string userName)
    {
        userName = userName?.ToUpper();
        var user = await _dbContext.Users.AsNoTracking()
            .Where(u => u.NormalizedUserName == userName)
            .ProjectTo<UserProfileFullInfo>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();
        return user;
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

    public async Task SetMainPhoto(string photoId, string userId)
    {
        var photos = await _dbContext.Photos
            .Where(x => x.UserId == userId).ToListAsync();

        var photo = photos.FirstOrDefault(p => p.Id == photoId);
        if (photo == null)
            throw new FrameworkException(ErrorCode.REPO0007, "Photo is not belong to current user.");

        photos.ForEach(p => p.IsMain = false);
        photo.IsMain = true;
        await _dbContext.SaveChangesAsync();
    }
}