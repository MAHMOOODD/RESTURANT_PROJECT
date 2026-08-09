using System.ComponentModel.DataAnnotations;

namespace Resturant_Backend.DTO.Review
{
    public class AddReviewDto
    {


        public int ProductId { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        public string? Comment { get; set; }

    }
}
