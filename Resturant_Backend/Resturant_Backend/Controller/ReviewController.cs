using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO.Review;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;
using Resturant_Backend.Roles;
using System.Security.Claims;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ReviewController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet("Get/{ProductId:int}")]
        public async Task<IActionResult> GetReviews(int ProductId)
        {

            var product = await _unitOfWork.ProductsRepo.GetAsync(ProductId);

            if(product is null)
            {
                return BadRequest("Product Not Found");

            }

            var reviews = _unitOfWork.ReviewRepo.GetAllReviews(ProductId);

            if(reviews is null)
            {
                return NotFound("No Reviews Found");
            }

            var reviewToShow = _mapper.Map<List<GetReviewDto>>(reviews);
            return Ok(reviewToShow);
        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpGet("getById/{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var review = await _unitOfWork.ReviewRepo.GetAsync(id);

            if(review is null)
            {
                return NotFound("Try Again with Right Id");
            }

            var reviewToShow = _mapper.Map<GetReviewDto>(review);

            return Ok(reviewToShow);
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]

        [HttpPost("Add")]
        public async Task<IActionResult> Add(AddReviewDto dto)
        {

            var reviewToAdd = _mapper.Map<Review>(dto);
            var review = await _unitOfWork.ReviewRepo.AddAsync(reviewToAdd);
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if(userId is null)
            {
                return Unauthorized("You are not authorized to edit this review");
            }
            review.AppuserId = userId;

            await _unitOfWork.SaveChangesAsync();
            if(review is null)
            {
                return BadRequest("Can not Add This Reviwe");


            }
            GetReviewDto reviewToShow = _mapper.Map<GetReviewDto>(review);
            return CreatedAtAction(nameof(Get), new { id = review.Id }, reviewToShow);
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Edit(int id, EditReviewDto dto)
        {
            var review = await _unitOfWork.ReviewRepo.GetAsync(id);
            if(review is null)
            {
                return NotFound("cannot found this review");

            }
            _mapper.Map(dto, review);
            var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if(userId is null)
            {
                return Unauthorized("You are not authorized to edit this review");
            }
            review.AppuserId = userId;
            await _unitOfWork.SaveChangesAsync();
            var reviewToShow = _mapper.Map<GetReviewDto>(review);
            return Ok(reviewToShow);
        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deletedReview = await _unitOfWork.ReviewRepo.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();


            if(deletedReview is null)
            {
                return BadRequest("Error happen when Delete this review");
            }

            return NoContent();
        }
    }
}
