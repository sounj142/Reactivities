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
        var error = ErrorResponse.Create(name, context, messages);
        return JsonSerializer.Serialize(error, jsonOptions);
    }

    public static string GenerateErrorContent(HttpContext context,
        IDictionary<string, string[]> failures)
    {
        var error = ErrorResponse.Create(context, failures);
        return JsonSerializer.Serialize(error, jsonOptions);
    }
}