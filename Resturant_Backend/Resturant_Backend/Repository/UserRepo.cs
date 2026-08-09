using Resturant_Backend.Data;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;

namespace Resturant_Backend.Repository
{
    public class UserRepo : Repository<Appuser>, IUser
    {
        private AppDbContext _context;
        public UserRepo(AppDbContext context) : base(context)
        {
            this._context = context;
        }



        public async Task<(string address, bool found)> GetUserAddressAsync(string userId)
        {

            var user = await _context.Users.FindAsync(userId);

            if(user is null)
            {
                return ("", false);
            }

            var address = user.Address;
            if(address is null)
            {
                return ("", false);
            }
            return (address, true);
        }

    }
}
