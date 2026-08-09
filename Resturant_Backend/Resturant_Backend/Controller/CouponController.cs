using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO.Coupon;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;
using Resturant_Backend.Roles;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CouponController(IUnitOfWork unitOfWork, IMapper mapper)

        {
            this._unitOfWork = unitOfWork;
            this._mapper = mapper;

        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpGet]
        public async Task<IActionResult> GetAllCoupons()
        {

            var coupons = await _unitOfWork.CouponRepo.GetAllAsync();
            if(coupons is null)
            {
                return NotFound("No Coupons Found");
            }

            return Ok(coupons);

        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetCouponById(int id)
        {
            var coupon = await _unitOfWork.CouponRepo.GetAsync(id);
            if(coupon is null)
            {
                return NotFound("No Coupon Found");
            }
            return Ok(coupon);
        }


        [Authorize(Roles = $"{Role.Admin}")]

        [HttpPost("Add")]
        public async Task<IActionResult> AddCoupon(AddCouponDto dto)

        {

            var coupon = _mapper.Map<Coupon>(dto);

            var addedCoupon = await _unitOfWork.CouponRepo.AddAsync(coupon);
            await _unitOfWork.SaveChangesAsync();

            if(addedCoupon is null)
            {
                return BadRequest("Cannot Add This Coupon");
            }

            var couponShow = _mapper.Map<GetCouponDto>(addedCoupon);

            return CreatedAtAction(nameof(GetCouponById), new { id = addedCoupon.Id }, couponShow);

        }
        [Authorize(Roles = $"{Role.Admin}")]


        [HttpPut("Edit/{id:int}")]
        public async Task<IActionResult> EditCoupon(int id, EditCouponDto dto)
        {
            var Coupon = await _unitOfWork.CouponRepo.GetAsync(id);

            if(Coupon is null)
                return NotFound($"Coupon with id : {id} is not found ");

            _mapper.Map(dto, Coupon);

            await _unitOfWork.SaveChangesAsync();

            var couponShow = _mapper.Map<GetCouponDto>(Coupon);
            return Ok(couponShow);
        }
        [Authorize(Roles = $"{Role.Admin}")]

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteCoupon(int id)
        {
            var coupon = await _unitOfWork.CouponRepo.DeleteAsync(id);

            await _unitOfWork.SaveChangesAsync();

            if(coupon is null)
            {
                return BadRequest("Can not Delete This Coupon");
            }


            return NoContent();

        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]

        [HttpPost("Validate")]
        public async Task<IActionResult> ValidateCoupon(string code, decimal Amount)
        {
            var (message, isvalid, dicount) = await _unitOfWork.CouponRepo.ValidateCoupon(code, Amount);


            if(isvalid == false)
            {
                return BadRequest(message);
            }

            return Ok(message);
        }
    }
}
