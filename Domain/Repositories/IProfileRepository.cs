using Domain.Photos;

namespace Domain.Repositories;

public interface IProfileRepository
{
    Task<UserProfile> GetUserProfile(string userId);
    Task<Photo> CreatePhoto(string id, string url, string userId, bool isMain);
    Task DeletePhoto(string id);
}