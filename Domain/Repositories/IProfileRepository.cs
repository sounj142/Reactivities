using Domain.Photos;

namespace Domain.Repositories;

public interface IProfileRepository
{
    Task<UserProfile> GetUserProfile(string userId);
    Task<UserProfileFullInfo> GetUserProfileByUserName(string userName);
    Task<Photo> CreatePhoto(string id, string url, string userId, bool isMain);
    Task DeletePhoto(string id);
    Task SetMainPhoto(string photoId, string userId);
    Task UpdateUserAboutInfo(string userId, string displayName, string bio);
}