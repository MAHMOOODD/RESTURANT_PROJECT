using System.ComponentModel.DataAnnotations;

namespace Resturant_Backend.DTO.Products
{
    public class AddProductDto
    {

        [Required(ErrorMessage = "Name Is Required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Name Is Required")]
        public string NameAr { get; set; } = "";

        [Required(ErrorMessage = "Description Is Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Description Is Required")]
        public string DescriptionAr { get; set; } = "";


        [Required(ErrorMessage = "Price Is Required")]
        public decimal Price { get; set; }


        public int PreparingTime { get; set; } // in minutes


        [Required(ErrorMessage = "Image URL Is Required")]
        [RegularExpression(pattern: @".+\.(jpg|jpeg|png|gif|webp)$", ErrorMessage = "Invalid Image Format")]

        public string ImageUrl { get; set; }

        [Required(ErrorMessage = "Availability Status Is Required")]
        public bool IsAvailable { get; set; }

        [Required(ErrorMessage = "Category ID Is Required")]
        public int CategoryId { get; set; }

    }
}
