using System.Text.Json.Serialization;

namespace Resturant_Backend.DTO
{
    public class UserCreatedModel
    {
        public string Message { get; set; }

        public bool IsAuth { get; set; }

        public string UserName { get; set; }
        public string Email { get; set; }

        public List<string>? Roles { get; set; }
        public string Token { get; set; }

        public DateTime ExpiredOn { get; set; }
        [JsonIgnore]
        public string? RefreshToken { get; set; }

        public DateTime RefreshTokenExpiration { get; set; }

    }
}
