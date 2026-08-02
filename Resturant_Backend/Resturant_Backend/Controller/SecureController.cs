using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TestJwt.Controller
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SecureController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("This is a secure endpoint.");
        }
    }
}
