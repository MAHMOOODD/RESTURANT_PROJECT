using Microsoft.EntityFrameworkCore;
using Resturant_Backend.Data;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;

namespace Resturant_Backend.Repository
{
    public class ProductsRepo : Repository<Product>, IProducts
    {
        private readonly AppDbContext _context;
        public ProductsRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<List<Product>> GetAllAsync()
        {
            return await _context.Products.Include(c => c.Details).Include(c => c.CartItems).Include(c => c.Reviews).ToListAsync();
        }

        public override async Task<Product?> GetAsync(int id)
        {
            return await _context.Products.Include(c => c.Details).Include(c => c.CartItems).Include(c => c.Reviews).FirstOrDefaultAsync(c => c.Id == id);
        }

    }
}
