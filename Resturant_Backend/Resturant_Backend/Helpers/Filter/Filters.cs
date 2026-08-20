using Resturant_Backend.Helpers.Pagination;

namespace Resturant_Backend.Helpers.Filter
{
    public class Filters
    {

        public PaginationFilter Pagination { get; set; } = new PaginationFilter();


        public bool? SortByPrice { get; set; } = null;

        public bool? SortBySelling { get; set; } = null;

        public bool Ascending { get; set; } = true;
    }
}
