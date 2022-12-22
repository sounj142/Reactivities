using System.Text.Json.Serialization;

namespace API.Identity.Dtos;

public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Image { get; set; }
    public bool IsEmptyCredential { get; set; }

    [JsonIgnore]
    public string SecurityStamp { get; set; }

    public string Token { get; set; }
    public string RefreshToken { get; set; }
}