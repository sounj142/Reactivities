namespace Domain.Exceptions;

public class FrameworkException : Exception
{
    public FrameworkException(string message) : base(message)
    {
    }

    public FrameworkException(string message, Exception innerException) : base(message, innerException)
    {
    }
}