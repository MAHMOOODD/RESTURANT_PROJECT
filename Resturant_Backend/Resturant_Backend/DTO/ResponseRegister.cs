namespace Resturant_Backend.DTO
{
    public class ResponseRegister
    {


        public string UserName { get; set; }
        public string Email { get; set; }

        public List<string>? Roles { get; set; }
        public string Token { get; set; }



    }
}
