namespace Domain.Services;

public interface ICurrentUserContext
{
    string GetCurrentUserId();
    string GetCurrentUserName();
    string GetCurrentUserEmail();
    DateTimeOffset GetClientNow();
}