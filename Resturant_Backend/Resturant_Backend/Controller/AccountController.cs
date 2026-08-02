using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO;
using Resturant_Backend.Services;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMapper _mapper;

        public AccountController(IAuthService authService, IMapper mapper)
        {
            _authService = authService;
            _mapper = mapper;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync(RegisterModel model)
        {
            var result = await _authService.RegisterAsync(model);

            if(!result.IsAuth)
                return BadRequest(ModelState);

            SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);


            return Ok(_mapper.Map<ResponseRegister>(result));
        }
        [HttpPost("Login")]
        public async Task<IActionResult> GetTokenAsync(TokenRequestModel model)
        {
            var result = await _authService.GetTokenAsync(model);

            if(!result.IsAuth)
                return BadRequest(result.Message);

            if(!string.IsNullOrEmpty(result.RefreshToken))
                SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

            return Ok(_mapper.Map<ResponseLogin>(result));
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("AddRole")]
        public async Task<IActionResult> AddRoleAsync(AddRoleDto model)
        {
            var result = await _authService.AddRoleAsync(model);

            return string.IsNullOrEmpty(result) ? Ok(model) : BadRequest(result);

        }

        [HttpPost("RefreshToken")]

        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var result = await _authService.RefreshTokenAsync(refreshToken);

            if(!result.IsAuth)
                return BadRequest(result.Message);

            SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpiration);

            return Ok(result);


        }

        [HttpPost("RevokeToken")]
        public async Task<IActionResult> RevokeToken(RevokeToken Dto)
        {
            var token = Dto.Token ?? Request.Cookies["refreshToken"];

            if(string.IsNullOrEmpty(token))
                return BadRequest("Token is required!");


            var result = await _authService.RevokeTokenAsync(token);

            if(!result)
                return BadRequest("Token is invalid!");

            return Ok();


        }



        private void SetRefreshTokenInCookie(string refreshToken, DateTime expires)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true, // حماية فائقة
                Expires = expires.ToLocalTime(),
                Secure = true, // يفضل إضافتها لتعمل عبر HTTPS فقط
                IsEssential = true,
                SameSite = SameSiteMode.None
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }


    }
}

