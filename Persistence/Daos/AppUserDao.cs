using Microsoft.AspNetCore.Identity;

namespace Persistence.Daos;

public class AppUserDao : IdentityUser
{
    public string DisplayName { get; set; }
    public string Bio { get; set; }

    public IList<ActivityAttendeeDao> Activities { get; set; }
    public IList<PhotoDao> Photos { get; set; }
}