using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.Common.Exceptions;
using Resturant_Backend.Common.Helpers;
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

        Ensure.Check(!result.IsAuth, result?.Message ?? "Registration failed.");

        if(!string.IsNullOrEmpty(result.RefreshToken))
            SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

        return this.Success(_mapper.Map<ResponseRegister>(result));
    }

    [HttpGet("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmailAsync([FromQuery] ConfirmEmailDto model)
    {
        await _authService.ConfirmEmailAsync(model);
        return this.SuccessMessage("Email confirmed successfully!");
    }

    [HttpPost("Login")]
    public async Task<IActionResult> GetTokenAsync([FromBody] TokenRequestModel model)
    {
        var result = await _authService.GetTokenAsync(model);

        Ensure.Check(!result.IsAuth, result?.Message ?? "Invalid email or password.");

        if(!string.IsNullOrEmpty(result.RefreshToken))
            SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

        return this.Success(_mapper.Map<ResponseLogin>(result));
    }

    [HttpPost("ForgetPassword")]
    public async Task<IActionResult> ForgetPasswordAsync([FromBody] ForgetPasswordDto model)
    {
        var origin = $"{Request.Scheme}://{Request.Host}";
        await _authService.ForgetPasswordAsync(model, origin);

        return this.SuccessMessage("Password reset link has been sent to your email.");
    }

    [HttpPost("ResetPassword")]
    public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordDto model)
    {
        await _authService.ResetPasswordAsync(model);
        return this.SuccessMessage("Password reset successfully!");
    }

    [Authorize]
    [HttpPut("UpdateProfile")]
    public async Task<IActionResult> UpdateProfileAsync([FromBody] UpdateProfileDto model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        Ensure.Unauthorized(userId, "غير مصرح لك بالوصول، يرجى تسجيل الدخول.");

        await _authService.UpdateProfileAsync(userId!, model);
        return this.SuccessMessage("Profile updated successfully!");
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("AddRole")]
    public async Task<IActionResult> AddRoleAsync([FromBody] AddRoleDto model)
    {
        await _authService.AddRoleAsync(model);
        return this.SuccessMessage("Role added successfully!");
    }

    [HttpPost("RefreshToken")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        Ensure.NotNullOrEmpty(refreshToken, "Refresh token is required!");

        var result = await _authService.RefreshTokenAsync(refreshToken!);
        Ensure.Check(!result.IsAuth, result?.Message ?? "Invalid refresh token.");

        SetRefreshTokenInCookie(result.RefreshToken!, result.RefreshTokenExpiration);

        return this.Success(result);
    }

    [HttpPost("RevokeToken")]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeToken? dto)
    {
        var token = dto?.Token ?? Request.Cookies["refreshToken"];
        Ensure.NotNullOrEmpty(token, "Token is required!");

        var isRevoked = await _authService.RevokeTokenAsync(token!);
        Ensure.Check(!isRevoked, "Token is invalid!");

        return this.SuccessMessage("Token revoked successfully.");
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