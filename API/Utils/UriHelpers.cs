using System.Reflection;
using System.Web;

namespace API.Utils;

public static class UriHelpers
{
    public static string AddQueryString(this string url, object queries)
    {
        var builder = new UriBuilder(url);
        if (builder.Uri.IsDefaultPort) builder.Port = -1;
        var query = HttpUtility.ParseQueryString(builder.Query);

        foreach (var prop in queries.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public))
        {
            query[prop.Name] = prop.GetValue(queries)?.ToString();
        }
        builder.Query = query.ToString();
        return builder.ToString();
    }
}