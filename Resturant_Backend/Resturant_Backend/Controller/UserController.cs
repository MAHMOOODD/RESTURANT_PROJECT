using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.Common.Exceptions;
using Resturant_Backend.Common.Helpers;
using Resturant_Backend.DTO.User;
using Resturant_Backend.Interfaces;
using System.Security.Claims;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;

        private readonly IMapper _mapper;

        public UserController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }


        [HttpGet("IsAuth")]
        public async Task<IActionResult> CheckAuth()
        {

            var isAuthenticated = User.Identity is not null && User.Identity.IsAuthenticated;
            Ensure.Check(!isAuthenticated, "User Is Not Authenticated");

            return this.Success(isAuthenticated);

        }
        [Authorize]
        [HttpGet("UserInfo")]
        public async Task<IActionResult> GetUserInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Ensure.Unauthorized(userId, "غير مصرح لك بالوصول، يرجى تسجيل الدخول.");
            var user = await _unitOfWork.UserRepo.GetUserInformationAsync(userId);


            return this.Success(_mapper.Map<GetUserInfo>(user));

        }









    }
}
