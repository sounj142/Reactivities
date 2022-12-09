namespace Application;

public class ErrorCode
{
    public static readonly string APP0001;
    public static readonly string APP0002;
    public static readonly string APP0003;
    public static readonly string APP0004;
    public static readonly string APP0005;
    public static readonly string APP0006;
    public static readonly string APP0007;
    public static readonly string APP0008;
    public static readonly string APP0009;
    public static readonly string APP0010;
    public static readonly string APP0011;
    public static readonly string APP0012;
    public static readonly string APP0013;
    public static readonly string APP0014;
    public static readonly string APP0015;
    public static readonly string APP0016;
    public static readonly string APP0017;
    public static readonly string APP0018;
    public static readonly string APP0019;
    public static readonly string APP0020;
    public static readonly string APP0021;
    public static readonly string APP0022;
    // user don't have permission to edit activity
    public static readonly string APP_DONT_HAVE_EDIT_PERMISSION;

    static ErrorCode()
    {
        Domain.Helpers.InitializeErrorCodeValues(typeof(ErrorCode));
    }
}