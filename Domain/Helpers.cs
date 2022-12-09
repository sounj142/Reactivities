using System.Reflection;

namespace Domain;

public static class Helpers
{
    public static void InitializeErrorCodeValues(Type errorCodeType)
    {
        foreach (var prop in errorCodeType.GetFields(BindingFlags.Public | BindingFlags.Static))
            prop.SetValue(null, "_" + prop.Name);
    }
}