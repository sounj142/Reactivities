namespace Persistence;

public static class ErrorCode
{
    // Error when unable to find Activity(by Id) to update
    public static readonly string REPO0001;
    public static readonly string REPO0002;
    // Error when unable to find Activity by Id
    public static readonly string REPO0003;
    public static readonly string REPO0004;
    public static readonly string REPO0005;
    public static readonly string REPO0006;

    static ErrorCode()
    {
        Domain.Helpers.InitializeErrorCodeValues(typeof(ErrorCode));
    }
}