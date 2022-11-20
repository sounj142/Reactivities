using Domain.Exceptions;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Utils;

public class ValidationException : FrameworkException
{
    public IDictionary<string, string[]> Failures { get; }

    public ValidationException() : base("One or more validation failures have occurred.")
    {
        Failures = new Dictionary<string, string[]>();
    }

    public ValidationException(ModelStateDictionary modelState) : this()
    {
        Failures = modelState.ToDictionary(
            pair => pair.Key,
            pair => pair.Value.Errors.Select(er => er.ErrorMessage).ToArray());
    }
}