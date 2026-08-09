using Resturant_Backend.DTO.Order;

namespace Resturant_Backend.DTO.Coupon
{
    public class GetCouponDto
    {
        public string Code { get; set; }
        public decimal Discount { get; set; }

        public decimal MinimumAmount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime ExpiryDate { get; set; } = DateTime.Now.AddDays(7);

        public bool IsActive { get; set; }
        public List<GetOrderDto> Orders { get; set; } = new();
    }
}
