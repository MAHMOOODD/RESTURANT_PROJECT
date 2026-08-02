using Microsoft.EntityFrameworkCore;

namespace Resturant_Backend.Models
{
    [Owned]
    public class RefreshToken
    {
        public string Token { get; set; }
        public DateTime ExpiresOn { get; set; }

        public bool IsExpires => DateTime.Now >= ExpiresOn;

        public DateTime CreatedOn { get; set; }
        public DateTime? RevokeOn { get; set; }

        public bool IsActive => RevokeOn is null && !IsExpires;

    }
}
