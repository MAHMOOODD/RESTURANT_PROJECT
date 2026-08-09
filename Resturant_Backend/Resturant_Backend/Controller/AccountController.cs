using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO.User;
using Resturant_Backend.Services;
using System.Security.Claims;

namespace Resturant_Backend.Controller;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IMapper _mapper;

    public AccountController(IAuthService authService, IMapper mapper)
    {
        _authService = authService;
        _mapper = mapper;
    }

    [HttpPost("Register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        var origin = $"{Request.Scheme}://{Request.Host}";
        var result = await _authService.RegisterAsync(model, origin);

        if(!result.IsAuth)
            return BadRequest(result.Message);

        if(!string.IsNullOrEmpty(result.RefreshToken))
            SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

        return Ok(_mapper.Map<ResponseRegister>(result));
    }

    [HttpGet("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmailAsync([FromQuery] ConfirmEmailDto model)
    {
        var result = await _authService.ConfirmEmailAsync(model);
        return string.IsNullOrEmpty(result) ? Ok(new { Message = "Email confirmed successfully!" }) : BadRequest(result);
    }

    [HttpPost("Login")]
    public async Task<IActionResult> GetTokenAsync([FromBody] TokenRequestModel model)
    {
        var result = await _authService.GetTokenAsync(model);

        if(!result.IsAuth)
            return BadRequest(result.Message);

        if(!string.IsNullOrEmpty(result.RefreshToken))
            SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

        return Ok(_mapper.Map<ResponseLogin>(result));
    }

    [HttpPost("ForgetPassword")]
    public async Task<IActionResult> ForgetPasswordAsync([FromBody] ForgetPasswordDto model)
    {
        var origin = $"{Request.Scheme}://{Request.Host}";
        var result = await _authService.ForgetPasswordAsync(model, origin);

        return string.IsNullOrEmpty(result)
            ? Ok(new { Message = "Password reset link has been sent to your email." })
            : BadRequest(result);
    }

    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordDto model)
    {
        var result = await _authService.ResetPasswordAsync(model);
        return string.IsNullOrEmpty(result) ? Ok(new { Message = "Password reset successfully!" }) : BadRequest(result);
    }

    [Authorize]
    [HttpPut("UpdateProfile")]
    public async Task<IActionResult> UpdateProfileAsync([FromBody] UpdateProfileDto model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(userId is null)
            return Unauthorized();

        var result = await _authService.UpdateProfileAsync(userId, model);
        return string.IsNullOrEmpty(result) ? Ok(new { Message = "Profile updated successfully!" }) : BadRequest(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("AddRole")]
    public async Task<IActionResult> AddRoleAsync([FromBody] AddRoleDto model)
    {
        var result = await _authService.AddRoleAsync(model);
        return string.IsNullOrEmpty(result) ? Ok(model) : BadRequest(result);
    }

    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if(string.IsNullOrEmpty(refreshToken))
            return BadRequest("Refresh token is required!");

        var result = await _authService.RefreshTokenAsync(refreshToken);

        if(!result.IsAuth)
            return BadRequest(result.Message);

        SetRefreshTokenInCookie(result.RefreshToken!, result.RefreshTokenExpiration);

        return Ok(result);
    }

    [HttpPost("RevokeToken")]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeToken Dto)
    {
        var token = Dto.Token ?? Request.Cookies["refreshToken"];

        if(string.IsNullOrEmpty(token))
            return BadRequest("Token is required!");

        var result = await _authService.RevokeTokenAsync(token);

        if(!result)
            return BadRequest("Token is invalid!");

        return Ok(new { Message = "Token revoked successfully." });
    }

    private void SetRefreshTokenInCookie(string refreshToken, DateTime expires)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = expires.ToLocalTime(),
            Secure = true,
            IsEssential = true,
            SameSite = SameSiteMode.None
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}