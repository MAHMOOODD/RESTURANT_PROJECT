using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Resturant_Backend.Models
{
    public class Appuser : IdentityUser
    {
        [MaxLength(50)]
        public required string FirstName { get; set; }
        [MaxLength(50)]
        public required string LastName { get; set; }

        public List<RefreshToken>? RefreshTokens { get; set; }
    }
}
