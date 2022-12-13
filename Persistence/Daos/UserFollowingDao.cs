namespace Persistence.Daos;

public class UserFollowingDao
{
    public string ObserverId { get; set; }
    public string TargetId { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public AppUserDao Observer { get; set; }
    public AppUserDao Target { get; set; }
}