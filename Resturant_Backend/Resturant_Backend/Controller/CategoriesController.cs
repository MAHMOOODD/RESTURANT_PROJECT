using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.DTO.Categories;
using Resturant_Backend.Interfaces;
using Resturant_Backend.Models;
using Resturant_Backend.Roles;

namespace Resturant_Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {

        public readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;
        public CategoriesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {

            var categories = await _unitOfWork.CategoreisRepo.GetAllAsync();
            var res = _mapper.Map<List<GetCategoriesDto>>(categories);
            return Ok(res);
        }
        [HttpGet("GetById/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {

            var category = await _unitOfWork.CategoreisRepo.GetAsync(id);
            if(category is null)
            {
                return NotFound("Category Not Found");
            }
            var res = _mapper.Map<GetCategoriesDto>(category);
            return Ok(res);
        }


        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]
        [HttpPost("Add")]

        public async Task<IActionResult> Add(AddCategoriesDto category)
        {
            var categoryToAdd = _mapper.Map<Category>(category);

            var Cat = await _unitOfWork.CategoreisRepo.AddAsync(categoryToAdd);

            await _unitOfWork.SaveChangesAsync();


            if(Cat is null)
            {
                return BadRequest("Cant Add This Category Please Try Again ");
            }
            var catToShow = _mapper.Map<GetCategoriesDto>(Cat);

            return CreatedAtAction(nameof(GetById), new { id = Cat.Id }, catToShow);
        }
        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]

        [HttpPut(template: "Edit/{id:int}")]

        public async Task<IActionResult> Edit(int id, EditCategoriesDto editCategoriesDto)
        {

            var categoryToEdit = await _unitOfWork.CategoreisRepo.GetAsync(id);

            if(categoryToEdit is null)
            {
                return NotFound("Category Not Found");
            }

            _mapper.Map(editCategoriesDto, categoryToEdit);
            await _unitOfWork.SaveChangesAsync();
            var catToShow = _mapper.Map<GetCategoriesDto>(categoryToEdit);

            return Ok(editCategoriesDto);

        }

        [Authorize(Roles = $"{Role.Admin}")]

        [HttpDelete("Delete/{id:int}")]

        public async Task<IActionResult> Delete(int id)
        {
            var categoryToDelete = await _unitOfWork.CategoreisRepo.DeleteAsync(id);
            if(categoryToDelete is null)
            {
                return NotFound("Category Not Found");
            }

            await _unitOfWork.SaveChangesAsync();

            return NoContent();
        }

    }
}
