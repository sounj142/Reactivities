using System.Diagnostics;
using System.Text.Json;

namespace API.Utils;

public static class DictionaryHelper
{
    private static readonly JsonSerializerOptions jsonOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DictionaryKeyPolicy = JsonNamingPolicy.CamelCase,
    };

    public static string GenerateErrorContent(string name, HttpContext context,
        params string[] messages)
    {
        var error = new ErrorResponse
        {
            Errors = new Dictionary<string, string[]> { { name, messages } },
            TraceId = Activity.Current?.Id ?? context?.TraceIdentifier
        };
        return JsonSerializer.Serialize(error, jsonOptions);
    }

    public static string GenerateErrorContent(HttpContext context,
        IDictionary<string, string[]> failures)
    {
        var error = new ErrorResponse
        {
            Errors = failures,
            TraceId = Activity.Current?.Id ?? context?.TraceIdentifier
        };
        return JsonSerializer.Serialize(error, jsonOptions);
    }
}