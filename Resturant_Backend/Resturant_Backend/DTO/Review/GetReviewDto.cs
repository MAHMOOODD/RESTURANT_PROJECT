namespace Resturant_Backend.DTO.Review
{
    public class GetReviewDto
    {
        public int Id { get; set; }

        public string AppuserId { get; set; }


        public int ProductId { get; set; }


        public int Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
