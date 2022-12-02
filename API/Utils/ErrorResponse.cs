namespace API.Utils;

public class ErrorResponse
{
    public string TraceId { get; set; }
    public IDictionary<string, string[]> Errors { get; set; }
}