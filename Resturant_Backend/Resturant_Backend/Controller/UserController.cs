using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        [Authorize]
        public async Task<IActionResult> CheckAuth()
        {
            return this.SuccessMessage("Authenticated");

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


        [Authorize]
        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            var roles = User
                .FindAll(ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();
            if(!roles.Any())
            {
                this.NotFoundEx("Role not found");
            }

            return this.Success(roles);
        }





    }
}
