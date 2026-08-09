using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Resturant_Backend.DTO.User;
using Resturant_Backend.Helpers;
using Resturant_Backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Resturant_Backend.Services;

public class Authservice : IAuthService
{
    private readonly UserManager<Appuser> _userManager;
    private readonly JwtHelper _jwtHelper;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly SignInManager<Appuser> _signInManager;
    private readonly IEmailService _emailService;

    public Authservice(
        UserManager<Appuser> userManager,
        IOptions<JwtHelper> options,
        RoleManager<IdentityRole> roleManager,
        SignInManager<Appuser> signInManager,
        IEmailService emailService)
    {
        _userManager = userManager;
        _jwtHelper = options.Value;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _emailService = emailService;
    }

    public async Task<UserCreatedModel> RegisterAsync(RegisterModel model, string origin)
    {
        if(await _userManager.FindByEmailAsync(model.Email) is not null)
            return new UserCreatedModel { Message = "Email is already registered!" };

        if(await _userManager.FindByNameAsync(model.UserName) is not null)
            return new UserCreatedModel { Message = "Username is already registered!" };

        var user = new Appuser
        {
            FullName = model.FullName,
            Address = model.Address,
            UserName = model.UserName,
            Email = model.Email,
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if(!result.Succeeded)
        {
            var errors = string.Empty;
            foreach(var error in result.Errors)
                errors += $"{error.Description},\n";

            return new UserCreatedModel { Message = errors };
        }

        await _userManager.AddToRoleAsync(user, "User");

        // ✉️ توليد وإرسال إيميل التفعيل المنسق
        var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedCode = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        var confirmationUrl = $"{origin}/api/Account/ConfirmEmail?userId={user.Id}&token={encodedCode}";


        var messageBody = $@"
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                <h2>مرحباً بك في موقعنا! 👋</h2>
                <p>شكراً لتسجيلك. يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني:</p>
                <a href='{confirmationUrl}' style='display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;'>تأكيد البريد الإلكتروني</a>
            </div>";

        // ابقي شيلها 
        Console.WriteLine(confirmationUrl);
        await _emailService.SendEmailAsync(user.Email, "Confirm Your Email", messageBody);

        return new UserCreatedModel
        {
            Email = user.Email,
            IsAuth = true,
            Message = "User registered successfully! Please check your email to confirm your account.",
            UserName = user.UserName,
            Roles = new List<string> { "User" }
        };
    }

    public async Task<UserCreatedModel> GetTokenAsync(TokenRequestModel model)
    {
        var authModel = new UserCreatedModel();

        var user = await _userManager.FindByEmailAsync(model.Email);

        if(user is null)
        {
            authModel.Message = "Email or Password is incorrect!";
            return authModel;
        }


        // 🔒 التحقق من تأكيد البريد الإلكتروني
        if(!user.EmailConfirmed)
        {
            authModel.Message = "Email is not confirmed yet. Please check your inbox.";
            return authModel;
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: true);

        if(result.IsLockedOut)
        {
            authModel.Message = "Account is locked. Try again after 5 minutes.";
            return authModel;
        }

        if(!result.Succeeded)
        {
            authModel.Message = "Email or Password is incorrect!";
            return authModel;
        }

        var jwtSecurityToken = await CreateJwtToken(user);
        var rolesList = await _userManager.GetRolesAsync(user);

        authModel.IsAuth = true;
        authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        authModel.Email = user.Email;
        authModel.UserName = user.UserName;
        authModel.ExpiredOn = jwtSecurityToken.ValidTo;
        authModel.Roles = rolesList.ToList();

        if(user.RefreshTokens.Any(t => t.IsActive))
        {
            var activeRefreshToken = user.RefreshTokens.FirstOrDefault(t => t.IsActive);
            authModel.RefreshToken = activeRefreshToken!.Token;
            authModel.RefreshTokenExpiration = activeRefreshToken.ExpiresOn;
        }
        else
        {
            var refreshToken = GenerateRefreshToken();
            authModel.RefreshToken = refreshToken.Token;
            authModel.RefreshTokenExpiration = refreshToken.ExpiresOn;
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);
        }

        return authModel;
    }

    public async Task<string> ConfirmEmailAsync(ConfirmEmailDto model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId);
        if(user is null)
            return "User not found";

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
        var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

        return result.Succeeded ? string.Empty : "Failed to confirm email";
    }

    public async Task<string> ForgetPasswordAsync(ForgetPasswordDto model, string origin)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if(user is null)
            return "Email does not exist";

        // ✉️ توليد وإرسال إيميل إعادة تعيين كلمة المرور المنسق
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        var resetUrl = $"{origin}/reset-password?email={user.Email}&token={encodedToken}";

        var messageBody = $@"
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                <h2>طلب إعادة تعيين كلمة المرور 🔐</h2>
                <p>لقد أرسلت طلباً لإعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر للتغيير:</p>
                <a href='{resetUrl}' style='display: inline-block; padding: 10px 20px; color: #fff; background-color: #dc3545; text-decoration: none; border-radius: 5px;'>إعادة تعيين كلمة المرور</a>
            </div>";

        await _emailService.SendEmailAsync(user.Email, "Reset Your Password", messageBody);

        return string.Empty;
    }

    public async Task<string> ResetPasswordAsync(ResetPasswordDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if(user is null)
            return "User not found";

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
        var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

        return result.Succeeded ? string.Empty : string.Join(", ", result.Errors.Select(e => e.Description));
    }

    public async Task<string> UpdateProfileAsync(string userId, UpdateProfileDto model)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if(user is null)
            return "User not found";

        user.FullName = model.FullName ?? user.FullName;
        user.Address = model.Address ?? user.Address;

        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded ? string.Empty : "Failed to update profile";
    }

    public async Task<string> AddRoleAsync(AddRoleDto model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId);

        if(user is null || !await _roleManager.RoleExistsAsync(model.RoleName))
            return "Invalid user ID or Role";

        if(await _userManager.IsInRoleAsync(user, model.RoleName))
            return "User already assigned to this role";

        var result = await _userManager.AddToRoleAsync(user, model.RoleName);

        return result.Succeeded ? string.Empty : "Something went wrong";
    }

    public async Task<UserCreatedModel> RefreshTokenAsync(string token)
    {
        var authModel = new UserCreatedModel();

        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

        if(user == null)
        {
            authModel.Message = "Invalid token";
            return authModel;
        }

        var refreshToken = user.RefreshTokens.Single(t => t.Token == token);

        if(!refreshToken.IsActive)
        {
            authModel.Message = "Inactive token";
            return authModel;
        }

        refreshToken.RevokeOn = DateTime.UtcNow;

        var newRefreshToken = GenerateRefreshToken();
        user.RefreshTokens.Add(newRefreshToken);
        await _userManager.UpdateAsync(user);

        var jwtToken = await CreateJwtToken(user);
        authModel.IsAuth = true;
        authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
        authModel.Email = user.Email;
        authModel.UserName = user.UserName;
        var roles = await _userManager.GetRolesAsync(user);
        authModel.Roles = roles.ToList();
        authModel.RefreshToken = newRefreshToken.Token;
        authModel.RefreshTokenExpiration = newRefreshToken.ExpiresOn;

        return authModel;
    }

    public async Task<bool> RevokeTokenAsync(string token)
    {
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

        if(user == null)
            return false;

        var refreshToken = user.RefreshTokens.Single(t => t.Token == token);

        if(!refreshToken.IsActive)
            return false;

        refreshToken.RevokeOn = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);

        return true;
    }

    private async Task<JwtSecurityToken> CreateJwtToken(Appuser user)
    {
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roles = await _userManager.GetRolesAsync(user);
        var roleClaims = new List<Claim>();

        foreach(var role in roles)
            roleClaims.Add(new Claim(ClaimTypes.Role, role));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
        }
        .Union(userClaims)
        .Union(roleClaims);

        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtHelper.Key));
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = new JwtSecurityToken(
            issuer: _jwtHelper.Issuer,
            audience: _jwtHelper.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtHelper.DurationInMinutes),
            signingCredentials: signingCredentials);

        return jwtSecurityToken;
    }

    private RefreshToken GenerateRefreshToken()
    {
        var token = RandomNumberGenerator.GetBytes(32);
        var now = DateTimeOffset.UtcNow;

        return new RefreshToken
        {
            Token = Convert.ToBase64String(token),
            ExpiresOn = now.AddDays(10).UtcDateTime,
            CreatedOn = now.UtcDateTime
        };
    }
}