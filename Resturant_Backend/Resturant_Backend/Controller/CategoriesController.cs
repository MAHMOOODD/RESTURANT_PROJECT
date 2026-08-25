using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Resturant_Backend.Common.Helpers;
using Resturant_Backend.DTO.Categories;
using Resturant_Backend.Helpers.PhotosHandle;
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
        private readonly IPhotoService _photoService;

        public CategoriesController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _unitOfWork.CategoreisRepo.GetAllAsync();
            var res = _mapper.Map<List<GetCategoriesDto>>(categories);
            return this.Success(res);
        }

        [HttpGet("GetById/{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _unitOfWork.CategoreisRepo.GetAsync(id);
            Ensure.NotNull(category, "Category Not Found");
            var res = _mapper.Map<GetCategoriesDto>(category);
            return this.Success(res);
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]
        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromForm] AddCategoriesDto category)
        {
            var categoryToAdd = _mapper.Map<Category>(category);

            // رفع الصورة لو مرفوعة
            if(category.ImageUrl != null && category.ImageUrl.Length > 0)
            {
                var uploadResult = await _photoService.AddPhotoAsync(category.ImageUrl);
                Ensure.Check(uploadResult.Error == null, uploadResult.Error?.Message ?? "Image upload failed");

                categoryToAdd.ImageUrl = uploadResult.SecureUrl.ToString();
                categoryToAdd.ImagePublicId = uploadResult.PublicId;
            }

            var Cat = await _unitOfWork.CategoreisRepo.AddAsync(categoryToAdd);
            Ensure.NotNull(Cat, "Cant Add This Category Please Try Again");

            await _unitOfWork.SaveChangesAsync();

            var catToShow = _mapper.Map<GetCategoriesDto>(Cat);
            return this.Success(catToShow);
        }

        [Authorize(Roles = $"{Role.Admin},{Role.Manager}")]
        [HttpPut("Edit/{id:int}")]
        public async Task<IActionResult> Edit(int id, [FromForm] EditCategoriesDto editCategoriesDto)
        {
            var categoryToEdit = await _unitOfWork.CategoreisRepo.GetAsync(id);
            Ensure.NotNull(categoryToEdit, "Category Not Found");

            // 1. تحديث البيانات الأساسية أولاً عبر AutoMapper
            _mapper.Map(editCategoriesDto, categoryToEdit);

            var imageFile = editCategoriesDto.ImageUrl;

            // 2. معالجة الصورة بشكل ذقي وموحد (مشابه للـ Products)
            if(imageFile != null)
            {
                // حذف الصورة القديمة مسبقاً إذا كانت موجودة
                if(!string.IsNullOrEmpty(categoryToEdit.ImagePublicId))
                {
                    await _photoService.DeletePhotoAsync(categoryToEdit.ImagePublicId);
                }

                if(imageFile.Length > 0)
                {
                    // 📸 رفع صورة جديدة
                    var uploadResult = await _photoService.AddPhotoAsync(imageFile);
                    Ensure.Check(uploadResult.Error == null, uploadResult.Error?.Message ?? "Image upload failed");

                    categoryToEdit.ImageUrl = uploadResult.SecureUrl.ToString();
                    categoryToEdit.ImagePublicId = uploadResult.PublicId;
                }
                else
                {
                    // 🗑️ حذف الصورة تماماً (تم إرسال ملف فارغ بطول 0 من الـ Frontend)
                    categoryToEdit.ImageUrl = null;
                    categoryToEdit.ImagePublicId = null;
                }
            }
            // لو imageFile بـ null، سيتم الإبقاء على الصورة القديمة تلقائياً

            await _unitOfWork.SaveChangesAsync();
            var catToShow = _mapper.Map<GetCategoriesDto>(categoryToEdit);

            return this.Success(catToShow);
        }

        [Authorize(Roles = $"{Role.Admin}")]
        [HttpDelete("Delete/{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            // تم تصحيح الترتيب: التأكد من وجود العنصر أولاً قبل الحذف
            var categoryToDelete = await _unitOfWork.CategoreisRepo.GetAsync(id);
            Ensure.NotNull(categoryToDelete, "Category Not Found");

            // حذف الصورة من Cloudinary لو موجودة
            if(!string.IsNullOrEmpty(categoryToDelete.ImagePublicId))
            {
                await _photoService.DeletePhotoAsync(categoryToDelete.ImagePublicId);
            }

            await _unitOfWork.CategoreisRepo.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return this.SuccessMessage("Category deleted successfully.");
        }
    }
}