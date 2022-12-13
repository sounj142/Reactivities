using Domain.Followers;

namespace Application.Followers.Dtos;

public class FollowOrUnfollowResultDto
{
    public UserFollower Observer { get; set; }
    public UserFollower Target { get; set; }
}