namespace ImageServices;

public class ErrorCode
{
    public static readonly string IMGO0001;
    public static readonly string IMGO0002;

    static ErrorCode()
    {
        Domain.Helpers.InitializeErrorCodeValues(typeof(ErrorCode));
    }
}