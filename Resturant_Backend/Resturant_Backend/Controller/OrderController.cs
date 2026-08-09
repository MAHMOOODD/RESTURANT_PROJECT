using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO.Order;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;
using Resturant_Backend.Roles;
using System.Security.Claims;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public OrderController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]


        [HttpPost("Add")]
        public async Task<IActionResult> AddOrder(AddOrderDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var (address, found) = await _unitOfWork.UserRepo.GetUserAddressAsync(userId);


            if(found == false && dto.UserAddress is null)
            {
                return BadRequest("you must provide an address");
            }



            var cartItems = _unitOfWork.CartRepo.GetAllCartItems(userId);

            if(cartItems is null || cartItems.Count < 1)
            {
                return BadRequest("Cart is Empty");
            }

            var totalPrice = cartItems.Sum(c => c.Quantity * c.Product.Price);
            var priceAfterDiscount = 0M;

            decimal Discount = 0;
            if(dto.Coupon is not null)
            {
                var (message, coupon, discount) = await _unitOfWork.CouponRepo.ValidateCoupon(dto.Coupon, totalPrice);

                if(coupon == false)
                    return BadRequest(message);

                if(coupon == true)
                {
                    priceAfterDiscount = totalPrice - ( ( discount / 100 ) * totalPrice );
                    Discount = discount;
                }
            }

            var Coupon = await _unitOfWork.CouponRepo.GetCoupon(dto.Coupon);

            var Order = new Order
            {
                AppuserId = userId,
                UserAddress = address == "" ? dto.UserAddress : address,
                TotalPrice = totalPrice,
                Discount = Discount,
                CouponId = Coupon?.Id ?? null,
                PaymentStatus = PaymentStatus.Pending,
                Status = OrderStatus.Pending,
                OrderDetails = cartItems.Select(c => new OrderDetails
                {
                    ProductId = c.ProductId,
                    Quantity = c.Quantity,
                    Price = c.Product.Price
                }).ToList()

            };
            var or = await _unitOfWork.OrderRepo.AddAsync(Order);


            foreach(var item in cartItems)
            {
                item.Product.SellCount += item.Quantity;
            }

            await _unitOfWork.CartRepo.ClearCart(userId);

            await _unitOfWork.SaveChangesAsync();
            var OrderToshow = _mapper.Map<ResponseAddDto>(Order);
            OrderToshow.PriceAfterDiscount = priceAfterDiscount == 0 ? totalPrice : priceAfterDiscount;
            OrderToshow.Coupon = dto.Coupon ?? "";

            return Ok(OrderToshow);

        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager},{Role.User}")]

        [HttpGet("MyOrders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var orders = _unitOfWork.OrderRepo.GetUserOrders(userId);

            if(orders is null || orders.Count < 1)
            {
                return BadRequest("Make an order First");

            }
            var ordersToShow = _mapper.Map<List<GetOrderDto>>(orders);

            return Ok(ordersToShow);
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpGet("Get{id:int}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _unitOfWork.OrderRepo.GetAsync(id);
            if(order is null)
            {
                return NotFound("Order does not Exist");
            }

            var orderToShow = _mapper.Map<GetOrderDto>(order);

            return Ok(orderToShow);
        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpGet("Get")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _unitOfWork.OrderRepo.GetAllAsync();
            if(orders is null)
            {
                return NotFound("There is no orders in the system");
            }

            var ordersToShow = _mapper.Map<List<GetOrderDto>>(orders);

            return Ok(ordersToShow);
        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]
        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, StatusResponseDto dto)
        {
            var order = await _unitOfWork.OrderRepo.GetAsync(id);

            if(order is null)
                return NotFound($"Order with ID {id} was not found.");

            bool wasOrderActive = order.Status != OrderStatus.Cancelled
                               && order.PaymentStatus != PaymentStatus.Failed;

            if(dto.Status.HasValue)
                order.Status = dto.Status.Value;

            if(dto.PaymentStatus.HasValue)
                order.PaymentStatus = dto.PaymentStatus.Value;

            bool isOrderNowCancelledOrFailed = order.Status == OrderStatus.Cancelled
                                            || order.PaymentStatus == PaymentStatus.Failed;

            if(wasOrderActive && isOrderNowCancelledOrFailed)
            {
                if(order.OrderDetails is not null)
                {
                    foreach(var detail in order.OrderDetails)
                    {
                        if(detail.Product is not null)
                        {
                            detail.Product.SellCount -= detail.Quantity;
                        }
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync();

            var orderToShow = _mapper.Map<GetOrderDto>(order);

            return Ok(new
            {
                Message = "Order status updated successfully",
                Order = orderToShow
            });
        }

    }
}
