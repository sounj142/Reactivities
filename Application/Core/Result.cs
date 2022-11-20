namespace Application.Core;

public class Result
{
    protected Result(bool succeeded, string message)
    {
        Succeeded = succeeded;
        Message = message;
    }

    public bool Succeeded { get; }
    public string Message { get; }

    public static Result Success()
    {
        return new Result(true, null);
    }

    public static Result Failure(string message)
    {
        return new Result(false, message);
    }
}

public class Result<T> : Result
{
    public T Value { get; }

    protected Result(bool succeeded, T value, string message) : base(succeeded, message)
    {
        Value = value;
    }

    public static Result<T> Success(T value)
    {
        return new Result<T>(true, value, null);
    }

    public new static Result Failure(string message)
    {
        return new Result<T>(false, default, message);
    }
}