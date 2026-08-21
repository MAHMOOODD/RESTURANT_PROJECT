using Microsoft.EntityFrameworkCore;
using Resturant_Backend.Data;
using Resturant_Backend.Helpers.Filter;
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

        public IQueryable<Product> GetAll(Filters filters)
        {
            var products = _context.Products.Skip(( filters.Pagination.PageNumber - 1 ) * filters.Pagination.PageSize)
                .Take(filters.Pagination.PageSize);

            var sortedProducts = SortProductBy(products, filters.SortByPrice, filters.SortBySelling, filters.Ascending);
            return sortedProducts;
        }

        public override async Task<Product?> GetAsync(int id)
        {
            return await _context.Products.Include(c => c.Details).Include(c => c.CartItems).Include(c => c.Reviews)
                .ThenInclude(r => r.Appuser)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public Task<int> GetProductCountAsync()
        {
            return _context.Products.CountAsync();
        }

        public IQueryable<Product> GetProductsByCategory(string categoryName, Filters filters)
        {
            var products = _context.Products
                .Skip(( filters.Pagination.PageNumber - 1 ) * filters.Pagination.PageSize).Take(filters.Pagination.PageSize).Where(p => p.Category.Name == categoryName);
            return SortProductBy(products, filters.SortByPrice, filters.SortBySelling, filters.Ascending);
        }
        public IQueryable<Product> GetProductsByCategory(int categoryId, Filters filters)
        {
            var products = _context.Products
                .Skip(( filters.Pagination.PageNumber - 1 ) * filters.Pagination.PageSize).Take(filters.Pagination.PageSize).Where(p => p.Category.Id == categoryId);
            return SortProductBy(products, filters.SortByPrice, filters.SortBySelling, filters.Ascending);
        }

        public IQueryable<Product> GetProductsByName(string name, Filters filters)
        {
            var products = _context.Products.Skip(( filters.Pagination.PageNumber - 1 ) * filters.Pagination.PageSize).Take(filters.Pagination.PageSize)
                .Where(p => p.Name.Contains(name));
            return SortProductBy(products, filters.SortByPrice, filters.SortBySelling, filters.Ascending);
        }



        public IQueryable<Product> SortProductBy(IQueryable<Product> products, bool? price, bool? selling, bool ascending)
        {

            if(price == true && selling == true)
            {
                return ascending ? products.OrderBy(p => p.Price).ThenBy(p => p.SellCount) : products.OrderByDescending(p => p.Price).
                    ThenBy(p => p.SellCount);


            }
            if(price == true)
            {
                return ascending ? products.OrderBy(p => p.Price) : products.OrderByDescending(p => p.Price);
            }

            if(selling == true)
            {
                return ascending ? products.OrderBy(p => p.SellCount) : products.OrderByDescending(p => p.SellCount);
            }

            return products;



        }


    }
}
