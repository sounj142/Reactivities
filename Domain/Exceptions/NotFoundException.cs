namespace Domain.Exceptions;

public class NotFoundException : FrameworkException
{
    public NotFoundException(string errorCode, string message) : base(errorCode, message)
    {
    }

    public NotFoundException(string errorCode, string message, Exception innerException) : base(errorCode, message, innerException)
    {
    }
}