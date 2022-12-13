namespace Domain.Followers;

public class UserFollower
{
    public string Id { get; set; }
    public string DisplayName { get; set; }
    public string UserName { get; set; }
    public string Bio { get; set; }
    public string Image { get; set; }
    public bool CurrentUserFollowing { get; set; }
    public int FolowersCount { get; set; }
    public int FolowingsCount { get; set; }
}

public class UserFollowing : UserFollower { }