namespace API.Identity.Dtos;

public class UserDto
{
    public string Email { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public string Image { get; set; }
    public string Token { get; set; }
}