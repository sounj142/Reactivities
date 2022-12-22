namespace API.Utils;

public static class ErrorCode
{
    public static readonly string INVALID_GUID;
    public static readonly string VALIDATION_ERROR;
    public static readonly string UNKNOWN_ERROR;
    public static readonly string API0001;
    public static readonly string API0002;
    public static readonly string EMAIL_NOT_CONFIRMED;

    static ErrorCode()
    {
        Domain.Helpers.InitializeErrorCodeValues(typeof(ErrorCode));
    }
}