using System.Diagnostics;
using FluentValidation.Results;

namespace API.Utils;

public class ErrorResponse
{
    public string TraceId { get; set; }
    public IDictionary<string, string[]> Errors { get; set; }

    private ErrorResponse(string traceId, IDictionary<string, string[]> errors)
    {
        TraceId = traceId;
        Errors = errors;
    }

    public static ErrorResponse Create(HttpContext context, IDictionary<string, string[]> errors)
    {
        var traceId = Activity.Current?.Id ?? context?.TraceIdentifier;
        return new ErrorResponse(traceId, errors);
    }

    public static ErrorResponse Create(string name, HttpContext context,
        params string[] messages)
    {
        return Create(context, new Dictionary<string, string[]> { { name, messages } });
    }

    public static ErrorResponse Create(HttpContext context, List<ValidationFailure> failures)
    {
        var traceId = Activity.Current?.Id ?? context?.TraceIdentifier;
        var errors = failures.GroupBy(x => x.PropertyName)
            .ToDictionary(x => x.Key, x => x.Select(x => x.ErrorMessage).ToArray());
        return new ErrorResponse(traceId, errors);
    }
}