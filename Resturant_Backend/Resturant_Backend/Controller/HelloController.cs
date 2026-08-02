using Microsoft.AspNetCore.Mvc;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class HelloController : ControllerBase
    {



        [HttpGet("hi")]
        public IActionResult hi()
        {
            return Ok("hello bro");

        }
    }
}
