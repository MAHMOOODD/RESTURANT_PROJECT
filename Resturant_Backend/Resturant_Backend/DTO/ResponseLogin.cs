namespace Resturant_Backend.DTO
{
    public class ResponseLogin
    {
        public string UserName { get; set; }
        public string Email { get; set; }

        public List<string>? Roles { get; set; }
        public string Token { get; set; }


    }

}
