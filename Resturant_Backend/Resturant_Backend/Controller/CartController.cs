using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO.Cart;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;
using Resturant_Backend.Roles;
using System.Security.Claims;

namespace Resturant_Backend.Controller
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;


        public CartController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]
        [HttpGet("GetCart")]

        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var cartItems = _unitOfWork.CartRepo.GetAllCartItems(userId!);

            if(cartItems is null || !cartItems.Any())
            {
                return NotFound("Make sure you have items in your cart.");
            }
            var cartItemsToShow = _mapper.Map<List<GetCartDto>>(cartItems);
            return Ok(cartItemsToShow);
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]

        [HttpPost("AddToCart/{productId:int}")]
        public async Task<IActionResult> AddToCart(int productId, EditCartItemDto dto)
        {


            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var product = await _unitOfWork.ProductsRepo.GetAsync(productId);
            var exist = await _unitOfWork.CartRepo.IsItemExist(productId, userId!);
            if(exist)
            {

                return BadRequest("Item already exist in your cart.");
            }
            if(product is null)
            {
                return NotFound("Product Not Found");
            }

            var addDto = new AddToCartDto
            {
                AppuserId = userId!,
                ProductId = productId,
                Quantity = dto.Quantity
            };

            var cartItem = _mapper.Map<Cart_Item>(addDto);
            await _unitOfWork.CartRepo.AddAsync(cartItem);
            await _unitOfWork.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCart), new { id = cartItem.Id }, addDto);


        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpPut("EditCartItem/{cartItemId:int}")]
        public async Task<IActionResult> EditCartItem(int cartItemId, EditCartItemDto dto)
        {
            var cartitem = await _unitOfWork.CartRepo.GetAsync(cartItemId);
            if(cartitem is null)
            {
                return NotFound("Cart Item Is Not Exist");

            }

            cartitem.Quantity = dto.Quantity;

            await _unitOfWork.SaveChangesAsync();


            return Ok(dto);


        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]


        [HttpDelete("DeleteCartItem/{cartItemId:int}")]
        public async Task<IActionResult> Delete(int cartItemId)
        {


            var cartItem = await _unitOfWork.CartRepo.DeleteAsync(cartItemId);
            await _unitOfWork.SaveChangesAsync();

            if(cartItem is null)
            {
                return BadRequest("Failed to delete cart item");
            }

            return NoContent();

        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]
        [HttpDelete("ClearCart")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var deleted = await _unitOfWork.CartRepo.ClearCart(userId!);

            if(!deleted)
            {
                return BadRequest("cart is already empty");
            }
            return NoContent();
        }
    }
}