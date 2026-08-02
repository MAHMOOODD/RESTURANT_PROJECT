using Resturant_Backend.DTO;

namespace Resturant_Backend.Services
{
    public interface IAuthService
    {
        Task<UserCreatedModel> RegisterAsync(RegisterModel model);
        Task<UserCreatedModel> GetTokenAsync(TokenRequestModel model);
        Task<string> AddRoleAsync(AddRoleDto model);

        Task<UserCreatedModel> RefreshTokenAsync(string token);
        Task<bool> RevokeTokenAsync(string token);


    }
}
