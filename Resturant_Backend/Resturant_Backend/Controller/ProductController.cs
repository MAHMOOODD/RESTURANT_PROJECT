using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.Common.Exceptions;
using Resturant_Backend.Common.Helpers;
using Resturant_Backend.DTO.Products;
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
        public async Task<IActionResult> GetAll()
        {

            var products = await _unitOfWork.ProductsRepo.GetAllAsync();

            var res = _mapper.Map<List<GetProductDto>>(products);
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
