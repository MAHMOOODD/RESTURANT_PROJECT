using AutoMapper;
using Resturant_Backend.DTO.Cart;
using Resturant_Backend.DTO.Categories;
using Resturant_Backend.DTO.Coupon;
using Resturant_Backend.DTO.Order;
using Resturant_Backend.DTO.OrderDetails;
using Resturant_Backend.DTO.Products;
using Resturant_Backend.DTO.Review;
using Resturant_Backend.DTO.User;
using Resturant_Backend.Models;

namespace Resturant_Backend.Mapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<UserCreatedModel, ResponseRegister>().ReverseMap();
            CreateMap<UserCreatedModel, ResponseLogin>().ReverseMap();


            // categories Mapping
            CreateMap<Category, GetCategoriesDto>().ReverseMap();
            CreateMap<Category, AddCategoriesDto>().ReverseMap();
            CreateMap<Category, EditCategoriesDto>().ReverseMap();


            // products Mapping
            CreateMap<Product, GetProductDto>().ReverseMap();
            CreateMap<Product, AddProductDto>().ReverseMap();
            CreateMap<Product, EditProductDto>().ReverseMap();

            //cart Mapping
            CreateMap<Cart_Item, AddToCartDto>().ReverseMap();
            CreateMap<Cart_Item, GetCartDto>().ReverseMap();


            //Coupon Mapping
            CreateMap<Coupon, GetCouponDto>().ReverseMap();
            CreateMap<Coupon, EditCouponDto>().ReverseMap();
            CreateMap<Coupon, AddCouponDto>().ReverseMap();

            //Review Mapping

            CreateMap<Review, GetReviewDto>().ReverseMap();
            CreateMap<Review, AddReviewDto>().ReverseMap();
            CreateMap<Review, EditReviewDto>().ReverseMap();


            // Order Mapping


            CreateMap<ResponseAddDto, Order>().ReverseMap();
            CreateMap<Order, GetOrderDto>();

            // Order Details Mapping
            CreateMap<OrderDetails, GetDetailsDto>();
        }


    }
}
