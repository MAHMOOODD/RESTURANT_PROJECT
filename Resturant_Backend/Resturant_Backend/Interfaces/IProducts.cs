using Resturant_Backend.Helpers.Filter;
using Resturant_Backend.Models;

namespace Resturant_Backend.Interfaces
{
    public interface IProducts : IRepository<Product>
    {
        IQueryable<Product> GetAll(Filters filters);
        IQueryable<Product> GetProductsByName(string name, Filters filters);
        IQueryable<Product> GetProductsByCategory(string categoryName, Filters filters);

        IQueryable<Product> SortProductBy(IQueryable<Product> products, bool? price, bool? selling, bool ascending);
        Task<int> GetProductCountAsync();
    }
}
