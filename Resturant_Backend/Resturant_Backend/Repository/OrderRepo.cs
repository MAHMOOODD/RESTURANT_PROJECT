using Microsoft.EntityFrameworkCore;
using Resturant_Backend.Data;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;

namespace Resturant_Backend.Repository
{
    public class OrderRepo : Repository<Order>, IOrder
    {
        private readonly AppDbContext _context;
        public OrderRepo(AppDbContext context) : base(context)
        {
            _context = context;
        }
        public override async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders.Include(c => c.OrderDetails).ToListAsync();
        }

        public override async Task<Order?> GetAsync(int id)
        {
            return await _context.Orders.Include(c => c.OrderDetails).FirstOrDefaultAsync(o => o.Id == id);
        }


        public List<Order> GetUserOrders(string id)
        {
            return _context.Orders.Include(c => c.OrderDetails).Where(c => c.AppuserId == id).ToList();

        }
    }
}
