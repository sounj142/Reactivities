namespace API.Identity.Dtos;

public class VerifyEmailPostDto
{
    public string Token { get; set; }
    public string Email { get; set; }
}