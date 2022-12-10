namespace Domain.Photos;

public class UserProfile
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public IList<Photo> Photos { get; set; }
}

public class UserProfileFullInfo : UserProfile
{
    public string Image { get; set; }
}