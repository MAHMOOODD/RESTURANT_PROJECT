using Resturant_Backend.Data;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;

namespace Resturant_Backend.Repository
{
    public class ReviewRepo : Repository<Review>, IReview
    {
        private readonly AppDbContext _context;
        public ReviewRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public List<Review> GetAllReviews(int productId)
        {
            var reviews = _context.Reviews.Where(r => r.ProductId == productId).ToList();
            return reviews;
        }
    }
}
