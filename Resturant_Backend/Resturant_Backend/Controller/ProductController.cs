using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;
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
            return Ok(res);
        }
        [HttpGet("GetById/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {

            var product = await _unitOfWork.ProductsRepo.GetAsync(id);
            if(product is null)
            {
                return NotFound("Product Not Found");
            }
            var res = _mapper.Map<GetProductDto>(product);
            return Ok(res);
        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]
        [HttpPost("Add")]

        public async Task<IActionResult> Add(AddProductDto productDto)
        {
            var ProductToAdd = _mapper.Map<Product>(productDto);

            var catExist = await _unitOfWork.CategoreisRepo.GetAsync(productDto.CategoryId);
            if(catExist is null)
            {
                return NotFound("Category Not Found");
            }

            var Pro = await _unitOfWork.ProductsRepo.AddAsync(ProductToAdd);

            await _unitOfWork.SaveChangesAsync();


            if(Pro is null)
            {
                return BadRequest("Cant Add This Product Please Try Again ");
            }

            var proToShow = _mapper.Map<GetProductDto>(Pro);

            return CreatedAtAction(nameof(GetById), new { id = Pro.Id }, proToShow);
        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpPut("Edit/{id:int}")]

        public async Task<IActionResult> Edit(int id, EditProductDto editProductsDto)
        {

            var ProToEdit = await _unitOfWork.ProductsRepo.GetAsync(id);

            if(ProToEdit is null)
            {
                return NotFound("Product Not Found");
            }

            _mapper.Map(editProductsDto, ProToEdit);
            await _unitOfWork.SaveChangesAsync();

            var proToShow = _mapper.Map<GetProductDto>(ProToEdit);


            return Ok(proToShow);

        }

        [Authorize(Roles = $"{Role.Admin}")]

        [HttpDelete("Delete/{id:int}")]

        public async Task<IActionResult> Delete(int id)
        {
            var productToDelete = await _unitOfWork.ProductsRepo.DeleteAsync(id);
            if(productToDelete is null)
            {
                return NotFound("Product Not Found");
            }

            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }

    }
}
