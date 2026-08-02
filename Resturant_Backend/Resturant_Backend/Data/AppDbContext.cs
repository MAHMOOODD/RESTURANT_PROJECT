using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Resturant_Backend.Models;

namespace Resturant_Backend.Data
{
    public class AppDbContext : IdentityDbContext<Appuser>
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }




    }
}
