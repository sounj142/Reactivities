namespace API.Identity.Dtos;

public class RegisterDto
{
    public string Email { get; set; }
    public string UserName { get; set; }
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public string Password { get; set; }
}