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

    public DateTimeOffset GetClientNow()
    {
        var timeZoneHeader = _httpContextAccessor.HttpContext?.Request?.Headers?["time_zone"];
        var timeZoneText = timeZoneHeader?.FirstOrDefault();
        if (string.IsNullOrEmpty(timeZoneText))
        {
            timeZoneHeader = _httpContextAccessor.HttpContext?.Request?.Query?["time_zone"];
            timeZoneText = timeZoneHeader?.FirstOrDefault();
        }

        int timeOffsetInMinute;
        var date = DateTimeOffset.Now;
        if (int.TryParse(timeZoneText, out timeOffsetInMinute))
        {
            date = date.ToOffset(TimeSpan.FromMinutes(-timeOffsetInMinute));
        }
        return date;
    }
}