namespace Resturant_Backend.DTO.Dashboard
{
    public class RevenueSummaryDto
    {
        // إجمالي قيمة الأوردرز المكتملة (Delivered) قبل خصم الكوبونات
        public decimal TotalRevenue { get; set; }

        // صافي الربح: TotalRevenue بعد خصم قيمة الكوبونات المطبّقة
        public decimal NetRevenue { get; set; }

        // متوسط قيمة الأوردر الواحد المكتمل
        public decimal AverageOrderValue { get; set; }
    }
}
