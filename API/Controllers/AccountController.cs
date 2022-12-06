using API.Identity;
using API.Identity.Dtos;
using API.Utils;
using AutoMapper;
using Domain.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence.Daos;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<AppUserDao> _userManager;
    private readonly SignInManager<AppUserDao> _signInManager;
    private readonly IMapper _mapper;
    private readonly TokenService _tokenService;
    private readonly ICurrentUserContext _currentUserContext;

    public AccountController(
        UserManager<AppUserDao> userManager,
        SignInManager<AppUserDao> signInManager,
        IMapper mapper,
        TokenService tokenService,
        ICurrentUserContext currentUserContext)
    {
        _signInManager = signInManager;
        _mapper = mapper;
        _tokenService = tokenService;
        _currentUserContext = currentUserContext;
        _userManager = userManager;
    }

    private UserDto CreateUserDto(AppUserDao user)
    {
        var userDto = _mapper.Map<UserDto>(user);
        userDto.Token = _tokenService.CreateToken(user);
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

        return CreateUserDto(user);
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
            var errors = registerResult.Errors.ToDictionary(x => x.Code, x => new string[] { x.Description });
            var errorResponse = ErrorResponse.Create(HttpContext, errors);
            return BadRequest(errorResponse);
        }

        return CreateUserDto(user);
    }

    [HttpGet("current-user")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.FindByEmailAsync(_currentUserContext.GetCurrentUserEmail());
        return CreateUserDto(user);
    }
}
