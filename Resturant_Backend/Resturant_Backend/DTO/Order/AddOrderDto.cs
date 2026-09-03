namespace Resturant_Backend.DTO.Order
{
    public class AddOrderDto
    {
        public string? UserAddress { get; set; }
        public string? Coupon { get; set; }
    }

    public class AddPosOrderDto
    {
        public string? CustomerId { get; set; }      // لو عميل مسجل
        public string? GuestName { get; set; }        // لو Guest
        public string? GuestPhone { get; set; }
        public List<PosOrderItemDto> Items { get; set; } = new();
        public string? CouponCode { get; set; }
        public decimal AmountPaid { get; set; }
    }

    public class PosOrderItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
