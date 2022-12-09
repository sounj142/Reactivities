namespace Persistence.Daos;

public class PhotoDao
{
    public string Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
    public string UserId { get; set; }

    public AppUserDao User { get; set; }
}