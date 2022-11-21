using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Utils;

public class ValidationException : FrameworkException
{
    public IDictionary<string, string[]> Failures { get; }

    public ValidationException(string errorCode) : base(errorCode, "One or more validation failures have occurred.")
    {
        Failures = new Dictionary<string, string[]>();
    }

    public ValidationException(string errorCode, ModelStateDictionary modelState) : this(errorCode)
    {
        Failures = modelState.ToDictionary(
            pair => pair.Key,
            pair => pair.Value.Errors.Select(er => er.ErrorMessage).ToArray());
    }
}