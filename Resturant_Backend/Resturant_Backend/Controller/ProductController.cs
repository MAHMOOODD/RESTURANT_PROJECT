using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Resturant_Backend.Common.Helpers;
using Resturant_Backend.DTO.Products;
using Resturant_Backend.Helpers.Filter;
using Resturant_Backend.Helpers.Pagination;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;
using Resturant_Backend.Roles;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public ProductController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll([FromQuery] Filters filter)
        {
            var vaildFilter = new PaginationFilter(filter.Pagination.PageNumber, filter.Pagination.PageSize);

            var ProductsCount = await _unitOfWork.ProductsRepo.GetProductCountAsync();

            var products = await _unitOfWork.ProductsRepo.GetAll(filter).ToListAsync();

            var P = _mapper.Map<List<GetAllProductDto>>(products);
            var res = new PagedResponse<GetAllProductDto>(P, vaildFilter.PageNumber, vaildFilter.PageSize, ProductsCount);
            return this.Success(res);
        }
        [HttpGet("GetById/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {

            var product = await _unitOfWork.ProductsRepo.GetAsync(id);
            Ensure.NotNull(product, "Product Not Found");

            var res = _mapper.Map<GetProductDto>(product);
            return this.Success(res);
        }


        [HttpGet("GetProductByName")]
        public async Task<IActionResult> GetProductByName(string name, [FromQuery] Filters filters)
        {
            var products = await _unitOfWork.ProductsRepo.GetProductsByName(name, filters).ToListAsync();
            Ensure.NotNull(products, "Products Not Found");
            var ress = _mapper.Map<List<GetAllProductDto>>(products);
            var res = new PagedResponse<GetAllProductDto>(ress, filters.Pagination.PageNumber, filters.Pagination.PageSize, products.Count);
            return this.Success(res);
        }

        [HttpGet("GetProductByCategory")]
        public async Task<IActionResult> GetProductByCategory(string categoryName, [FromQuery] Filters filters)
        {
            var products = await _unitOfWork.ProductsRepo.GetProductsByCategory(categoryName, filters).ToListAsync();
            Ensure.NotNull(products, "Products Not Found");
            var ress = _mapper.Map<List<GetAllProductDto>>(products);
            var res = new PagedResponse<GetAllProductDto>(ress, filters.Pagination.PageNumber, filters.Pagination.PageSize, products.Count);
            return this.Success(res);
        }
        [HttpGet("GetProductByCategoryId")]
        public async Task<IActionResult> GetProductByCategory(int categoryId, [FromQuery] Filters filters)
        {
            var products = await _unitOfWork.ProductsRepo.GetProductsByCategory(categoryId, filters).ToListAsync();
            Ensure.NotNull(products, "Products Not Found");
            var ress = _mapper.Map<List<GetAllProductDto>>(products);
            var res = new PagedResponse<GetAllProductDto>(ress, filters.Pagination.PageNumber, filters.Pagination.PageSize, products.Count);
            return this.Success(res);
        }



        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]
        [HttpPost("Add")]

        public async Task<IActionResult> Add(AddProductDto productDto)
        {

            var catExist = await _unitOfWork.CategoreisRepo.GetAsync(productDto.CategoryId);
            Ensure.NotNull(catExist, "Category Not Found");


            var ProductToAdd = _mapper.Map<Product>(productDto);
            var Pro = await _unitOfWork.ProductsRepo.AddAsync(ProductToAdd);
            Ensure.NotNull(Pro, "Cant Add This Product Please Try Again ");

            await _unitOfWork.SaveChangesAsync();




            var proToShow = _mapper.Map<GetProductDto>(Pro);

            return this.Success(proToShow);
        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpPut("Edit/{id:int}")]

        public async Task<IActionResult> Edit(int id, EditProductDto editProductsDto)
        {

            var ProToEdit = await _unitOfWork.ProductsRepo.GetAsync(id);

            Ensure.NotNull(ProToEdit, "Product Not Found");

            _mapper.Map(editProductsDto, ProToEdit);
            await _unitOfWork.SaveChangesAsync();

            var proToShow = _mapper.Map<GetProductDto>(ProToEdit);


            return this.Success(proToShow);

        }

        [Authorize(Roles = $"{Role.Admin}")]

        [HttpDelete("Delete/{id:int}")]

        public async Task<IActionResult> Delete(int id)
        {
            var productToDelete = await _unitOfWork.ProductsRepo.DeleteAsync(id);
            Ensure.NotNull(productToDelete, "Product Not Found");

            await _unitOfWork.SaveChangesAsync();

            return this.SuccessMessage("Product Deleted Successfully");
        }

    }
}
