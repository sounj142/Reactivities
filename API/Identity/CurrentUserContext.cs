using System.Security.Claims;
using Domain.Services;

namespace API.Identity;

public class CurrentUserContext : ICurrentUserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CurrentUserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string GetCurrentUserId()
        => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string GetCurrentUserName()
        => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);

    public string GetCurrentUserEmail()
        => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);
}