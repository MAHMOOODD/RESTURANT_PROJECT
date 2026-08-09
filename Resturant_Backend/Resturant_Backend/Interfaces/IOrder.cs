using Resturant_Backend.Models;

namespace Resturant_Backend.Interfaces
{
    public interface IOrder : IRepository<Order>
    {
        List<Order> GetUserOrders(string id);
    }
}
