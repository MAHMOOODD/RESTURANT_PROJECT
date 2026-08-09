using Resturant_Backend.Models;

namespace Resturant_Backend.Interfaces
{
    public interface IReview : IRepository<Review>
    {


        List<Review> GetAllReviews(int productId);
    }
}
