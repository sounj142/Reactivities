namespace API.Utils;

public static class ErrorCode
{
    public static readonly string INVALID_GUID;
    public static readonly string VALIDATION_ERROR;
    public static readonly string UNKNOWN_ERROR;

    static ErrorCode()
    {
        Domain.Helpers.InitializeErrorCodeValues(typeof(ErrorCode));
    }
}