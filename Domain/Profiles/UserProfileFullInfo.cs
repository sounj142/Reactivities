using Domain.Followers;

namespace Domain.Profiles;

public class UserProfileFullInfo : UserProfile
{
    public string Image { get; set; }
    public IList<UserFollowing> Followings { get; set; }
    public IList<UserFollower> Followers { get; set; }
}