using System.ComponentModel.DataAnnotations;

namespace Resturant_Backend.DTO.User;

// ➕ الـ DTOs الجديدة
public class ConfirmEmailDto
{
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Token { get; set; } = string.Empty;
}
