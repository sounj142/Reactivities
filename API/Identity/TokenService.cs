using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Identity.Dtos;
using Microsoft.IdentityModel.Tokens;
using Persistence.Daos;

namespace API.Identity;

public class TokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private string CreateToken(SecurityTokenDescriptor tokenDescriptor)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        tokenDescriptor.SigningCredentials = credential;

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public string CreateToken(UserDto user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
        };
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:ExpireMinutes"])),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        return CreateToken(tokenDescriptor);
    }

    public string CreateRefreshToken(UserDto user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("SecurityStamp", user.SecurityStamp),
        };
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(int.Parse(_configuration["Jwt:RefreshExpireMinutes"])),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        return CreateToken(tokenDescriptor);
    }

    public ClaimsPrincipal ValidateToken(string token, bool validateLifetime)
    {
        if (token == null)
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var result = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = validateLifetime,
                ClockSkew = TimeSpan.Zero,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
            }, out SecurityToken validatedToken);

            return validatedToken != null ? result : null;
        }
        catch
        {
            // return null if validation fails
            return null;
        }
    }
}