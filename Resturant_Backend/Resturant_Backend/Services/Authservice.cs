
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Resturant_Backend.DTO;
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

    public Authservice(UserManager<Appuser> userManager, IOptions<JwtHelper> options, RoleManager<IdentityRole> roleManager, SignInManager<Appuser> signInManager)
    {
        _userManager = userManager;
        _jwtHelper = options.Value;
        _roleManager = roleManager;
        _signInManager = signInManager;
    }


    public async Task<UserCreatedModel> RegisterAsync(RegisterModel model)
    {
        if(await _userManager.FindByEmailAsync(model.Email) is not null)
            return new UserCreatedModel { Message = "Email is already registered!" };

        if(await _userManager.FindByNameAsync(model.UserName) is not null)
            return new UserCreatedModel { Message = "Username is already registered!" };

        var user = new Appuser
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            UserName = model.UserName,
            Email = model.Email,

        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if(!result.Succeeded)
        {
            var errors = string.Empty;

            foreach(var error in result.Errors)
                errors += $"{error.Description},";

            return new UserCreatedModel { Message = errors };
        }

        await _userManager.AddToRoleAsync(user, "User");

        var jwtSecurityToken = await CreateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshTokens?.Add(refreshToken);
        await _userManager.UpdateAsync(user);

        return new UserCreatedModel
        {
            Email = user.Email,
            ExpiredOn = jwtSecurityToken.ValidTo,
            IsAuth = true,
            Roles = new List<string> { "User" },
            Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
            UserName = user.UserName,
            RefreshToken = refreshToken.Token,
            RefreshTokenExpiration = refreshToken.ExpiresOn
        };
    }
    public async Task<string> AddRoleAsync(AddRoleDto model)
    {
        var user = await _userManager.FindByIdAsync(model.UserId);

        if(user is null || !await _roleManager.RoleExistsAsync(model.RoleName))
            return "Invalid user ID or Role";

        if(await _userManager.IsInRoleAsync(user, model.RoleName))
            return "User already assigned to this role";

        var result = await _userManager.AddToRoleAsync(user, model.RoleName);

        return result.Succeeded ? string.Empty : "Sonething went wrong";
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
            authModel.RefreshToken = activeRefreshToken.Token;
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
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Email, user.Email),
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


