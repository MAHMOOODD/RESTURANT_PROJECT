using System.ComponentModel.DataAnnotations;

namespace Resturant_Backend.DTO
{
    public class RegisterModel
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string UserName { get; set; }

        public required string Password { get; set; }
        [EmailAddress]
        public required string Email { get; set; }


    }
}
