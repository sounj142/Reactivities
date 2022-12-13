using Domain.Followers;
using Domain.Photos;
using Domain.Profiles;

namespace Domain.Repositories;

public interface IProfileRepository
{
    Task<UserProfile> GetUserProfile(string userId);
    Task<UserProfile> GetUserProfileByUserName(string userName);
    Task<UserProfileFullInfo> GetUserProfileFullInfoByUserName(string userName);
    Task<Photo> CreatePhoto(string id, string url, string userId, bool isMain);
    Task DeletePhoto(string id);
    Task SetMainPhoto(string photoId, string userId);
    Task UpdateUserAboutInfo(string userId, string displayName, string bio);
    Task<bool> HasFollowed(string observerId, string targetId);
    Task FollowUser(string observerId, string targetId, DateTimeOffset createdAt);
    Task UnfollowUser(string observerId, string targetId);
    Task<UserFollower> GetUserFollowerInfo(string userId);
}