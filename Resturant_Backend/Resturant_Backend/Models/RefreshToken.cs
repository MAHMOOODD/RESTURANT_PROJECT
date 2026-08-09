using Microsoft.EntityFrameworkCore;

namespace Resturant_Backend.Models
{
    [Owned]
    public class RefreshToken
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresOn { get; set; }

        // 🔴 التعديل الأول: استخدام UtcNow وتصحيح الاسم لـ IsExpired
        public bool IsExpired => DateTime.UtcNow >= ExpiresOn;

        public DateTime CreatedOn { get; set; }
        public DateTime? RevokeOn { get; set; }

        // 🔴 التعديل الثاني: الاعتماد على IsExpired المعدلة
        public bool IsActive => RevokeOn is null && !IsExpired;
    }
}