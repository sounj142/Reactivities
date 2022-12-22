using System.Security.Claims;
using API.Identity;
using API.Identity.Dtos;
using API.Utils;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain.Exceptions;
using Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence.Daos;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<AppUserDao> _userManager;
    private readonly SignInManager<AppUserDao> _signInManager;
    private readonly IMapper _mapper;
    private readonly TokenService _tokenService;
    private readonly ICurrentUserContext _currentUserContext;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public AccountController(
        UserManager<AppUserDao> userManager,
        SignInManager<AppUserDao> signInManager,
        IMapper mapper,
        TokenService tokenService,
        ICurrentUserContext currentUserContext,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
        _tokenService = tokenService;
        _currentUserContext = currentUserContext;
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    private Task<UserDto> GetUserDtoById(string userId)
    {
        return _userManager.Users.AsNoTracking()
            .ProjectTo<UserDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(x => x.Id == userId);
    }

    private async Task<UserDto> GenerateUserDto(string userId)
    {
        var userDto = await GetUserDtoById(userId);
        return GenerateUserDto(userDto);
    }

    private UserDto GenerateUserDto(UserDto userDto)
    {
        userDto.Token = _tokenService.CreateToken(userDto);
        userDto.RefreshToken = _tokenService.CreateRefreshToken(userDto);
        return userDto;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        const string invalidMessage = "Email or password is incorrect.";
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
            return BadRequest(invalidMessage);

        var loginResult = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        if (!loginResult.Succeeded)
            return BadRequest(invalidMessage);

        return await GenerateUserDto(user.Id);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
            return BadRequest("Email already in use.");
        if (await _userManager.FindByNameAsync(registerDto.UserName) != null)
            return BadRequest("User name already in use.");

        var user = _mapper.Map<AppUserDao>(registerDto);
        var registerResult = await _userManager.CreateAsync(user, registerDto.Password);

        if (!registerResult.Succeeded)
        {
            var errorResponse = ErrorResponse.Create(HttpContext, registerResult);
            return BadRequest(errorResponse);
        }

        return await GenerateUserDto(user.Id);
    }

    [HttpPost("facebook-login")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
        var fbAccount = await CallFacebookApi(accessToken);

        var user = await _userManager.FindByEmailAsync(fbAccount.Email);
        if (user != null)
            return await GenerateUserDto(user.Id);

        var userByUserName = await _userManager.FindByNameAsync(fbAccount.Id);
        if (userByUserName != null)
            fbAccount.Id += $"{fbAccount.Id}_{Guid.NewGuid().ToString().Replace("-", string.Empty)}";

        var newUser = new AppUserDao
        {
            Email = fbAccount.Email,
            UserName = fbAccount.Id,
            DisplayName = fbAccount.Name,
        };
        if (!string.IsNullOrEmpty(fbAccount.Picture?.Data?.Url))
        {
            newUser.Photos = new List<PhotoDao> {
                new PhotoDao {
                    Id = $"fb_{Guid.NewGuid().ToString().Replace("-", string.Empty)}",
                    IsMain = true,
                    Url = fbAccount.Picture.Data.Url
                }
            };
        }
        var registerResult = await _userManager.CreateAsync(newUser);
        if (!registerResult.Succeeded)
        {
            var errorResponse = ErrorResponse.Create(HttpContext, registerResult);
            return BadRequest(errorResponse);
        }

        return await GenerateUserDto(newUser.Id);
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto>> RefreshToken(RefreshTokenDto model)
    {
        var tokenClaims = _tokenService.ValidateToken(model.RefreshToken, true);
        if (tokenClaims == null)
            return BadRequest("Token unvalid or expired.");

        var userId = tokenClaims.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return BadRequest("Bad token.");

        var userDto = await GetUserDtoById(userId);
        if (userDto == null)
            return BadRequest("User not found.");

        var securityStamp = tokenClaims.Claims.FirstOrDefault(x => x.Type == "SecurityStamp")?.Value;
        if (userDto.SecurityStamp != securityStamp)
            return BadRequest("User credentials have changed.");

        return GenerateUserDto(userDto);
    }

    [HttpPut("change-password")]
    public async Task<ActionResult<UserDto>> ChangePassword(ChangePasswordDto model)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return BadRequest("User not found.");

        IdentityResult result;
        if (string.IsNullOrEmpty(model.CurrentPassword))
        {
            if (user.PasswordHash != null)
                return BadRequest("Incorrect password.");
            result = await _userManager.AddPasswordAsync(user, model.NewPassword);
        }
        else
        {
            result = await _userManager.ChangePasswordAsync(
                user, model.CurrentPassword, model.NewPassword);
        }
        if (!result.Succeeded)
            return BadRequest(result.Errors.FirstOrDefault()?.Description);

        return await GenerateUserDto(user.Id);
    }

    const string FB_BASEURL = "https://graph.facebook.com/";
    private async Task<FacebookAccountDto> CallFacebookApi(string accessToken)
    {
        using var client = _httpClientFactory.CreateClient();
        var verifyUrl = $"{FB_BASEURL}debug_token".BuildUri(new
        {
            input_token = accessToken,
            access_token = $"{_configuration["Facebook:AppId"]}|{_configuration["Facebook:AppSecret"]}"
        });
        var verifyToken = await client.GetAsync(verifyUrl);
        if (!verifyToken.IsSuccessStatusCode)
            throw new FrameworkException(ErrorCode.API0001, "User cancelled login or did not fully authorize.");

        var facebookUrl = $"{FB_BASEURL}me".BuildUri(new
        {
            access_token = accessToken,
            fields = "name,email,picture.width(100).height(100)"
        });
        var response = await client.GetAsync(facebookUrl);
        if (!response.IsSuccessStatusCode)
            throw new FrameworkException(ErrorCode.API0002, "User cancelled login or did not fully authorize.");

        var content = await response.Content.ReadFromJsonAsync<FacebookAccountDto>();
        return content;
    }
}
