namespace API.Utils;

public static class DictionaryHelper
{
    public static IDictionary<string, string[]> CreateErrorObject(string name, string message)
    {
        return new Dictionary<string, string[]> { { name, new[] { message } } };
    }

    public static IDictionary<string, string[]> CreateErrorObject(string name, params string[] messages)
    {
        return new Dictionary<string, string[]> { { name, messages } };
    }
}